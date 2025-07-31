export interface PrepareCollectionPurchaseRequest {
	collectionId: string;
	buyerId: string;
	artistWalletAddress: string;
}

export interface CompleteCollectionPurchaseRequest {
	collectionId: string;
	buyerId: string;
	txHash: string;
}