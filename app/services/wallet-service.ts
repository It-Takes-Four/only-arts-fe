import BaseService from './base-service';

export interface WalletLinkRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface WalletLinkResponse {
  id: string;
  userId: string;
  walletAddress: string;
  isVerified: boolean;
  linkedAt: string;
}

export interface UnlinkWalletResponse {
  success: boolean;
  message: string;
}

class WalletService extends BaseService {
  async linkWallet(linkData: WalletLinkRequest): Promise<WalletLinkResponse> {
    try {
      const { data } = await this._axios.post<WalletLinkResponse>('/wallets/link', linkData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to link wallet');
    }
  }

  async unlinkWallet(walletAddress: string): Promise<UnlinkWalletResponse> {
    try {
      const { data } = await this._axios.delete<UnlinkWalletResponse>(`/wallets/unlink/${walletAddress}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to unlink wallet');
    }
  }

  async getLinkedWallets(): Promise<WalletLinkResponse[]> {
    try {
      const { data } = await this._axios.get<WalletLinkResponse[]>('/wallets/linked');
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get linked wallets');
    }
  }

  async verifyWalletOwnership(walletAddress: string): Promise<{ message: string }> {
    try {
      const { data } = await this._axios.post<{ message: string }>('/wallets/verify-ownership', {
        walletAddress
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get verification message');
    }
  }
}

// Export singleton instance
export const walletService = new WalletService();
