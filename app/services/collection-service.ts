import BaseService from "./base-service";
import type {
	CreateCollectionRequest,
	CreateCollectionResponse, MyArtwork,
	MyArtworksResponse,
	MyCollection,
	MyCollectionsResponse,
	PaginatedCollectionsResponse
} from "../types/collection";

class CollectionService extends BaseService {

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

	async getMyCollections(page = 1, limit = 10): Promise<PaginatedCollectionsResponse> {
		try {
			const response = await this._axios.get<any>(`/art-collections/my/collections`, {
				params: { page, limit }
			});
			
			// Transform the response to match the expected format if needed
			const data = response.data;
			
			// If the API returns page/limit format, transform to currentPage/perPage
			if (data.pagination && 'page' in data.pagination && 'limit' in data.pagination) {
				return {
					data: data.data,
					pagination: {
						currentPage: data.pagination.page,
						perPage: data.pagination.limit,
						total: data.pagination.total,
						totalPages: data.pagination.totalPages,
						hasNextPage: data.pagination.hasNextPage,
						hasPrevPage: data.pagination.hasPrevPage,
						limit: data.pagination.limit
					}
				};
			}
			
			// If already in the correct format, return as is
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to get my collections');
		}
	}

	async getMyArtworks(page = 1, limit = 10): Promise<MyArtworksResponse> {
		try {
			const { data } = await this._axios.get('/art-collections/my/arts', {
				params: { page, limit }
			});
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

			if (request.description) {
				formData.append('description', request.description);
			}

			if (request.price !== undefined) {
				formData.append('price', request.price.toString());
			}

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

	async getCollectionsByArtist(artistId: string): Promise<MyCollection[]> {
		try {
			const { data } = await this._axios.get<MyCollectionsResponse>(`/art-collections/artist/${artistId}`);
			return data.data; // Return just the data array, not the full response
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to get collections by artist');
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

	// Update collection content (name, description, and price)
	async updateCollectionContent(collectionId: string, content: { collectionName: string; description: string; price?: number }) {
		try {
			const { data } = await this._axios.patch(`/art-collections/${collectionId}/content`, content);
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to update collection content');
		}
	}

	// Update collection cover image
	async updateCollectionCoverImage(collectionId: string, file: File) {
		try {
			const formData = new FormData();
			formData.append('coverImage', file);

			const { data } = await this._axios.patch(`/art-collections/${collectionId}/cover-image`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to update collection cover image');
		}
	}

	// Publish collection (irreversible)
	async publishCollection(collectionId: string) {
		try {
			const { data } = await this._axios.patch(`/art-collections/${collectionId}/publish`);
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to publish collection');
		}
	}

	async deleteCollection(collectionId: string) {
		try {
			await this._axios.delete(`/collections/${collectionId}`);
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to delete collection');
		}
	}

	async purchaseCollection(collectionId: string, artistWalletAddress: string) {
		try {
			const { data } = await this._axios.post('/collections/purchase', {
				collectionId,
				artistWalletAddress
			});
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to purchase collection');
		}
	}

	// Add art to collection
	async addArtToCollection(collectionId: string, artData: {
		title: string;
		description: string;
		tagIds: string[];
		file: File;
	}) {
		try {
			const formData = new FormData();
			formData.append('title', artData.title);
			formData.append('description', artData.description);
			
			// Add tag IDs as array
			artData.tagIds.forEach(tagId => {
				formData.append('tagIds', tagId);
			});
			
			formData.append('file', artData.file);

			const { data } = await this._axios.post(`/art-collections/${collectionId}/arts`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to add art to collection');
		}
	}

	// Delete art from collection
	async deleteArtFromCollection(collectionId: string, artId: string) {
		try {
			const { data } = await this._axios.delete(`/art-collections/${collectionId}/arts/${artId}`);
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to delete art from collection');
		}
	}

	// Get artworks in a collection
	async getCollectionArtworks(collectionId: string): Promise<MyArtwork[]> {
		try {
			const { data } = await this._axios.get<MyArtwork[]>(`/art-collections/${collectionId}/arts`);
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to get artworks in collection');
		}
	}
}

export const collectionService = new CollectionService();