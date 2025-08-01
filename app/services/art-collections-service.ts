import BaseService from './base-service';
import type { CompleteCollectionPurchaseRequest, PrepareCollectionPurchaseRequest } from "../types/collection-purchase";
import type { PurchasedCollectionsResponse } from "../types/purchased-collection";

class ArtCollectionsService extends BaseService {
    async prepareCollectionPurchase(request: PrepareCollectionPurchaseRequest): Promise<any> {
        try {
            const { data } = await this._axios.post<any>(`/art-collections/prepare-collection-purchase`, request);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to prepare collection purchase data');
        }
    }

    async completeCollectionPurchase(request: CompleteCollectionPurchaseRequest): Promise<any> {
        try {
            const { data } = await this._axios.post<any>(`/art-collections/complete-collection-purchase`, request);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to complete collection purchase');
        }
    }

    async getPurchasedCollections(page: number = 1, limit: number = 20): Promise<PurchasedCollectionsResponse> {
        try {
            const { data } = await this._axios.get<PurchasedCollectionsResponse>(`/art-collections/my/purchased-collections?page=${page}&limit=${limit}`);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch purchased collections');
        }
    }

    // Helper method to get collection cover image URL
    getCollectionImageUrl(collectionImageFileId: string): string {
        return `${import.meta.env.VITE_API_BASE_URL}/upload/collection/${collectionImageFileId}`;
    }

    // Helper method to get user profile picture URL
    getUserProfileImageUrl(profilePictureFileId: string): string {
        return `${import.meta.env.VITE_API_BASE_URL}/upload/user/${profilePictureFileId}`;
    }
}
// Export singleton instance
export const artCollectionsService = new ArtCollectionsService();
