import BaseService from "./base-service";
import type {
	CreateCollectionRequest,
	CreateCollectionResponse,
	MyCollection,
	MyCollectionsResponse
} from "../types/collection";
import type { MyArtworksResponse } from "../types/artwork";

class CollectionService extends BaseService{

	// Helper method to get collection cover image URL
	getCollectionImageUrl(collectionImageFileId: string): string {
		return `${import.meta.env.VITE_API_BASE_URL}/upload/collection/${collectionImageFileId}`;
	}

	// Helper method to get artwork image URL by imageFileId
	getArtworkImageUrl(artImageFileId: string): string {
		return `${import.meta.env.VITE_API_BASE_URL}/upload/art/${artImageFileId}`;
	}

	async getCollectionById(collectionId: string) {
		try {
			const { data } = await this._axios.get(`/art-collections/${collectionId}`);
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to get collection');
		}
	}

	async getMyCollections(): Promise<MyCollection[]> {
		try {
			const { data } = await this._axios.get<MyCollectionsResponse>('/art-collections/my/collections');
			return data.data; // Return just the data array, not the full response
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to get my collections');
		}
	}

	async getMyArtworks(): Promise<MyArtworksResponse> {
		try {
			const { data } = await this._axios.get('/art-collections/my/arts');
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to get my artworks');
		}
	}

	// New method for creating collection with the specified endpoint
	async createCollection(request: CreateCollectionRequest): Promise<CreateCollectionResponse> {
		try {
			const formData = new FormData();
			formData.append('collectionName', request.collectionName);
			
			if (request.file) {
				formData.append('file', request.file);
			}

			const { data } = await this._axios.post('/art-collections', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to create collection');
		}
	}

	// Legacy method - keeping for backward compatibility
	async createCollectionWithArts(artistId: string, collectionData: any) {
		try {
			const { data } = await this._axios.post(`/art-collections/create-with-arts`, collectionData);
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to create collection');
		}
	}

	async updateCollection(collectionId: string, collectionData: any) {
		try {
			const { data } = await this._axios.put(`/collections/${collectionId}`, collectionData);
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to update collection');
		}
	}

	async deleteCollection(collectionId: string) {
		try {
			await this._axios.delete(`/collections/${collectionId}`);
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to delete collection');
		}
	}
}

export const collectionService = new CollectionService();