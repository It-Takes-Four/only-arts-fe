import { artCollectionsService } from 'app/services/art-collections-service';
import { ethers } from 'ethers'
import { useState } from 'react';

interface PaymentModalProps {
    collectionId: string;
    artistWalletAddress: string;
}

export function PaymentModal({ collectionId, artistWalletAddress }: PaymentModalProps) {
    const TARGET_CHAIN_ID = import.meta.env.TARGET_CHAIN_ID
    const [paymentStatus, setpaymentStatus] = useState("Buy Collection")

    

    // const buyerId = "62b7a897-88be-45bb-88f9-f52ca1a712ec"
    // const collectionId = "76dff053-8f38-4caa-97bc-93fed67f9ad3"
    // const artistWalletAddress = "0xe774cd104A03ba1B401403A9Eb7B0778279c043F" // ko KE
    // const artistWalletAddress = "0xe39a19f4339A808B0Cd4e60CB98aC565698467FB" // Cathh
    // const price = "0.0001"

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
        // You'll need to configure these parameters for chainId 4202
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: `0x${TARGET_CHAIN_ID.toString(16)}`, // 4202 in hex = 0x106a
                chainName: 'Lisk Sepolia Testnet', // Replace with actual network name
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://rpc.sepolia-api.lisk.com'], // Replace with actual RPC URL
                blockExplorerUrls: ['https://sepolia-blockscout.lisk.com'] // Replace with block explorer
            }]
        });
    }

    const completeCollectionPurchase = async () => {
        try {
            setpaymentStatus("Processing payment...")

            const prepareCollectionPurchaseResult = await artCollectionsService.prepareCollectionPurchase({
                collectionId: collectionId,
                artistWalletAddress: artistWalletAddress,
                buyerId: buyerId,
                price: price
            })

            const contractAbi = prepareCollectionPurchaseResult.abi
            const contractAddress = prepareCollectionPurchaseResult.contractAddress

            await ensureCorrectNetwork();
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork()

            console.log(`Transaction sent to: ${network.name} (chainId: ${network.chainId})`);


            setpaymentStatus("Waiting for payment...")

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

            console.log("tx hash:", txHash);

            setpaymentStatus("Verifying purchase...")

            const result = await artCollectionsService.completeCollectionPurchase({
                collectionId: collectionId,
                buyerId: buyerId,
                price: Number(price),
                txHash: txHash
            });


            setpaymentStatus("Purchase completed...")

            console.log("buyAccessToCollection result:", result);
        } catch (error) {

        }
    }

    return (
        <>
            <button>{paymentStatus}</button>
        </>
    )
}
