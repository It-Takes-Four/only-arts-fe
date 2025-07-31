import BaseService from './base-service';
import type { CompleteCollectionPurchaseRequest, PrepareCollectionPurchaseRequest } from "../types/collection-purchase";

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
}
// Export singleton instance
export const artCollectionsService = new ArtCollectionsService();
