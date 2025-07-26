import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { walletService, type WalletLinkResponse } from '../../services/wallet-service';
import { toast } from 'sonner';

export function useWalletLink() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLinking, setIsLinking] = useState(false);
  const [linkedWallets, setLinkedWallets] = useState<WalletLinkResponse[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);

  const linkWallet = async (): Promise<WalletLinkResponse | null> => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet first');
      return null;
    }

    setIsLinking(true);
    try {
      // Step 1: Get verification message from backend
      const { message } = await walletService.verifyWalletOwnership(address);

      // Step 2: Sign the message
      const signature = await signMessageAsync({ message });

      // Step 3: Link wallet with signature
      const linkResponse = await walletService.linkWallet({
        walletAddress: address,
        signature,
        message
      });

      toast.success('Wallet linked successfully!');
      await loadLinkedWallets(); // Refresh the list
      return linkResponse;
    } catch (error: any) {
      console.error('Error linking wallet:', error);
      toast.error(error.message || 'Failed to link wallet');
      return null;
    } finally {
      setIsLinking(false);
    }
  };

  const unlinkWallet = async (walletAddress: string): Promise<boolean> => {
    try {
      setIsLoadingWallets(true);
      await walletService.unlinkWallet(walletAddress);
      toast.success('Wallet unlinked successfully!');
      await loadLinkedWallets(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('Error unlinking wallet:', error);
      toast.error(error.message || 'Failed to unlink wallet');
      return false;
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const loadLinkedWallets = async (): Promise<void> => {
    try {
      setIsLoadingWallets(true);
      const wallets = await walletService.getLinkedWallets();
      setLinkedWallets(wallets);
    } catch (error: any) {
      console.error('Error loading linked wallets:', error);
      toast.error(error.message || 'Failed to load linked wallets');
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const isWalletLinked = (walletAddress: string): boolean => {
    return linkedWallets.some(wallet => 
      wallet.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  };

  return {
    linkWallet,
    unlinkWallet,
    loadLinkedWallets,
    isWalletLinked,
    isLinking,
    linkedWallets,
    isLoadingWallets,
    currentWalletAddress: address,
    isWalletConnected: isConnected
  };
}
