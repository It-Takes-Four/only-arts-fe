import BaseService from './base-service';
import type { UnlinkWalletResponse, WalletLinkRequest, WalletLinkResponse } from "../types/wallet";

// TEMPORARILY DISABLED - Backend endpoints not available yet
// Wallet connection via wagmi/RainbowKit still works, but no backend persistence
class WalletService extends BaseService {
  async linkWallet(linkData: WalletLinkRequest): Promise<WalletLinkResponse> {
    // TEMPORARILY DISABLED - No backend endpoint
    console.warn('Backend wallet linking disabled - using local simulation');
    
    // Return mock response for UI consistency
    return {
      id: 'temp-' + Date.now(),
      userId: 'current-user',
      walletAddress: linkData.walletAddress,
      isVerified: true,
      linkedAt: new Date().toISOString()
    };
  }

  async unlinkWallet(walletAddress: string): Promise<UnlinkWalletResponse> {
    // TEMPORARILY DISABLED - No backend endpoint
    console.warn('Backend wallet unlinking disabled - using local simulation');
    
    // Return success for UI consistency
    return {
      success: true,
      message: 'Wallet unlinked (local only - no backend)'
    };
  }

  async getLinkedWallets(): Promise<WalletLinkResponse[]> {
    // TEMPORARILY DISABLED - No backend endpoint
    console.warn('Backend wallet fetching disabled - returning empty array');
    
    // Return empty array - wallets will only be "linked" during current session
    return [];
  }

  async verifyWalletOwnership(walletAddress: string): Promise<{ message: string }> {
    // TEMPORARILY DISABLED - No backend endpoint
    console.warn('Backend wallet verification disabled - using local message');
    
    // Return a simple verification message for signing
    return {
      message: `Please sign this message to verify ownership of wallet: ${walletAddress}\n\nTimestamp: ${Date.now()}`
    };
  }
}

// Export singleton instance
export const walletService = new WalletService();
