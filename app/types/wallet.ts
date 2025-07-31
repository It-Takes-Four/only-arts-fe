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