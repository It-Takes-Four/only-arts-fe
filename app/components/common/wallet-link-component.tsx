import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletLink } from '../hooks/useWalletLink';
import { Button } from '../common/button';
import { toast } from 'sonner';

interface WalletLinkComponentProps {
  onWalletLinked?: (walletAddress: string) => void;
  onWalletUnlinked?: (walletAddress: string) => void;
}

export function WalletLinkComponent({ 
  onWalletLinked, 
  onWalletUnlinked 
}: WalletLinkComponentProps) {
  const {
    linkWallet,
    unlinkWallet,
    loadLinkedWallets,
    isWalletLinked,
    isLinking,
    linkedWallets,
    isLoadingWallets,
    currentWalletAddress,
    isWalletConnected
  } = useWalletLink();

  useEffect(() => {
    if (isWalletConnected) {
      loadLinkedWallets();
    }
  }, [isWalletConnected, loadLinkedWallets]);

  const handleLinkWallet = async () => {
    const result = await linkWallet();
    if (result && onWalletLinked) {
      onWalletLinked(result.walletAddress);
    }
  };

  const handleUnlinkWallet = async (walletAddress: string) => {
    const success = await unlinkWallet(walletAddress);
    if (success && onWalletUnlinked) {
      onWalletUnlinked(walletAddress);
    }
  };

  const isCurrentWalletLinked = currentWalletAddress 
    ? isWalletLinked(currentWalletAddress) 
    : false;

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Wallet Connection</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <ConnectButton 
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
            chainStatus={{
              smallScreen: 'icon',
              largeScreen: 'full',
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
          />
          
          {isWalletConnected && (
            <Button
              onClick={handleLinkWallet}
              disabled={isLinking || isCurrentWalletLinked}
              variant={isCurrentWalletLinked ? "outline" : "default"}
              className="min-w-32"
            >
              {isLinking 
                ? "Linking..." 
                : isCurrentWalletLinked 
                  ? "Already Linked" 
                  : "Link Wallet"
              }
            </Button>
          )}
        </div>
        
        {currentWalletAddress && (
          <div className="text-sm text-muted-foreground">
            Current wallet: {currentWalletAddress.slice(0, 6)}...{currentWalletAddress.slice(-4)}
            {isCurrentWalletLinked && (
              <span className="ml-2 text-green-600 dark:text-green-400">✓ Linked</span>
            )}
          </div>
        )}
      </div>

      {/* Linked Wallets List */}
      {linkedWallets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Linked Wallets</h3>
          <div className="space-y-2">
            {linkedWallets.map((wallet) => (
              <div 
                key={wallet.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-card"
              >
                <div className="flex flex-col">
                  <span className="font-mono text-sm">
                    {wallet.walletAddress.slice(0, 6)}...{wallet.walletAddress.slice(-4)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Linked: {new Date(wallet.linkedAt).toLocaleDateString()}
                    {wallet.isVerified && (
                      <span className="ml-2 text-green-600 dark:text-green-400">✓ Verified</span>
                    )}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleUnlinkWallet(wallet.walletAddress)}
                  disabled={isLoadingWallets}
                  variant="destructive"
                  size="sm"
                >
                  Unlink
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoadingWallets && (
        <div className="text-center text-muted-foreground">
          Loading wallet information...
        </div>
      )}
    </div>
  );
}
