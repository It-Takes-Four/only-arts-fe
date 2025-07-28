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
  // Local session storage for currently linked wallets (no backend persistence)
  const [sessionLinkedWallets, setSessionLinkedWallets] = useState<Set<string>>(new Set());

  const linkWallet = async (): Promise<WalletLinkResponse | null> => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet first');
      return null;
    }

    // Check if already linked in current session
    if (sessionLinkedWallets.has(address.toLowerCase())) {
      toast.info('Wallet is already linked in this session');
      return null;
    }

    setIsLinking(true);
    try {
      // Step 1: Get verification message (local only)
      const { message } = await walletService.verifyWalletOwnership(address);

      // Step 2: Sign the message to verify ownership
      const signature = await signMessageAsync({ message });

      // Step 3: "Link" wallet (local only - no backend)
      const linkResponse = await walletService.linkWallet({
        walletAddress: address,
        signature,
        message
      });

      // Add to session storage
      setSessionLinkedWallets(prev => new Set(prev).add(address.toLowerCase()));
      
      toast.success('Wallet linked successfully! (Session only - no backend storage)');
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
      
      // Remove from session storage
      setSessionLinkedWallets(prev => {
        const newSet = new Set(prev);
        newSet.delete(walletAddress.toLowerCase());
        return newSet;
      });
      
      await walletService.unlinkWallet(walletAddress);
      toast.success('Wallet unlinked successfully! (Session only)');
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
      // Since backend is disabled, we only show currently connected wallet if it's been "linked" in session
      const wallets: WalletLinkResponse[] = [];
      
      if (address && sessionLinkedWallets.has(address.toLowerCase())) {
        wallets.push({
          id: 'session-' + address,
          userId: 'current-user',
          walletAddress: address,
          isVerified: true,
          linkedAt: new Date().toISOString()
        });
      }
      
      setLinkedWallets(wallets);
    } catch (error: any) {
      console.error('Error loading linked wallets:', error);
      toast.error(error.message || 'Failed to load linked wallets');
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const isWalletLinked = (walletAddress: string): boolean => {
    return sessionLinkedWallets.has(walletAddress.toLowerCase());
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
