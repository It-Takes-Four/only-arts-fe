import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { ethers } from 'ethers';
import { artCollectionsService } from 'app/services/art-collections-service';
import { useState } from 'react';

export enum PaymentStatus {
    PROCESSING = "Processing",
    WAITING = "Waiting",
    VERIFYING = "Verifying",
    PURCHASED = "Purchased"
}

export function usePayment() {
    const { user } = useAuth();
    const buyerId = user?.id
    const TARGET_CHAIN_ID = Number(import.meta.env.VITE_TARGET_CHAIN_ID)

    const [paymentStatus, setpaymentStatus] = useState<PaymentStatus>(PaymentStatus.PROCESSING)

    async function ensureCorrectNetwork() {
        if (!window.ethereum) {
            throw new Error('MetaMask not installed');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        if (Number(network.chainId) !== TARGET_CHAIN_ID) {
            try {
                // Request network switch
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{
                        chainId: `0x${TARGET_CHAIN_ID.toString(16)}` // Convert to hex
                    }],
                });

                console.log(`Switched to chainId ${TARGET_CHAIN_ID}`);
            } catch (switchError) {
                await addNetworkToWallet();
            }
        }
    }

    async function addNetworkToWallet() {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: `0x${TARGET_CHAIN_ID.toString(16)}`, // 4202 in hex = 0x106a
                chainName: 'Lisk Sepolia Testnet',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
                blockExplorerUrls: ['https://sepolia-blockscout.lisk.com']
            }]
        });
    }

    const purchaseCollection = async (collectionId: string, artistWalletAddress: string) => {
        try {
            setpaymentStatus(PaymentStatus.PROCESSING)

            const prepareCollectionPurchaseResult = await artCollectionsService.prepareCollectionPurchase({
                collectionId: collectionId,
                artistWalletAddress: artistWalletAddress,
                buyerId: buyerId!
            })

            const contractAbi = prepareCollectionPurchaseResult.abi
            const contractAddress = prepareCollectionPurchaseResult.contractAddress
            const price = prepareCollectionPurchaseResult.parameters.price

            await ensureCorrectNetwork();
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            setpaymentStatus(PaymentStatus.WAITING)

            const contract = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer  // User's wallet signer
            );

            const tx = await contract.buyAccessToCollection(
                collectionId,
                buyerId,
                ethers.parseEther(price),
                artistWalletAddress,
                { value: ethers.parseEther(price) }
            );

            await tx.wait()

            const txHash = tx.hash;

            setpaymentStatus(PaymentStatus.VERIFYING)

            const result = await artCollectionsService.completeCollectionPurchase({
                collectionId: collectionId,
                buyerId: buyerId!,
                txHash: txHash
            });


            setpaymentStatus(PaymentStatus.PURCHASED)
            toast.success("Purchase Successful!")
        } catch (error: any) {
            console.log(error);
            toast.error("Purchase failed:", error.message)
        }
    }

    return {
        paymentStatus,
        purchaseCollection
    };
}
