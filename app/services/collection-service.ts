import BaseService from "./base-service";

export interface CreateCollectionRequest {
  collectionName: string;
  file?: File;
}

export interface CreateCollectionResponse {
  id: string;
  collectionName: string;
  coverImageFileId?: string;
  artistId: string;
  createdAt: string;
}

// Interface for the detailed collection response
export interface CollectionArt {
  id: string;
  artId: string;
  collectionId: string;
  addedAt: string;
  updatedAt: string;
  art: {
    id: string;
    imageFileId: string;
    title: string;
    description: string;
    datePosted: string;
    updatedAt: string;
    artistId: string;
    tokenId?: string;
    likesCount: number;
    isInACollection: boolean;
    tags: Array<{
      artId: string;
      tagId: string;
      tag: {
        id: string;
        tagName: string;
        usageCount: number;
        createdAt: string;
        updatedAt: string;
      };
    }>;
    comments: Array<{
      id: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      userId: string;
      artId: string;
      user: {
        id: string;
        email: string;
        username: string;
        profilePictureFileId?: string;
        createdAt: string;
        updatedAt: string;
      };
    }>;
    artist: {
      id: string;
      userId: string;
      artistName: string;
      isNsfw: boolean;
      bio?: string;
      walletAddress?: string;
      totalFollowers: number;
      totalArts: number;
      totalCollections: number;
      isVerified: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface MyCollection {
  id: string;
  collectionName: string;
  description?: string;
  coverImageFileId?: string;
  price?: any; // The price structure can be complex
  tokenId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  artistId: string;
  arts: CollectionArt[];
}

export type MyCollectionsResponse = MyCollection[];

// Interface for the artist's artwork response
export interface MyArtwork {
  id: string;
  imageFileId: string;
  title: string;
  description: string;
  datePosted: string;
  updatedAt: string;
  artistId: string;
  tokenId?: string;
  likesCount: number;
  isInACollection: boolean;
  tags: Array<{
    artId: string;
    tagId: string;
    tag: {
      id: string;
      tagName: string;
      usageCount: number;
      createdAt: string;
      updatedAt: string;
    };
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    artId: string;
    user: {
      id: string;
      email: string;
      username: string;
      profilePictureFileId?: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
  artist: {
    id: string;
    userId: string;
    artistName: string;
    isNsfw: boolean;
    bio?: string;
    walletAddress?: string;
    totalFollowers: number;
    totalArts: number;
    totalCollections: number;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export type MyArtworksResponse = MyArtwork[];

class CollectionService extends BaseService{

	// Helper method to get collection cover image URL
	getCollectionImageUrl(collectionId: string): string {
		return `${import.meta.env.VITE_API_BASE_URL}/upload/collection/${collectionId}`;
	}

	// Helper method to get artwork image URL by imageFileId
	getArtworkImageUrl(imageFileId: string): string {
		return `${import.meta.env.VITE_API_BASE_URL}/upload/art/${imageFileId}`;
	}

	async getCollectionById(collectionId: string) {
		try {
			const { data } = await this._axios.get(`/art-collections/${collectionId}`);
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to get collection');
		}
	}

	async getMyCollections(): Promise<MyCollectionsResponse> {
		try {
			const { data } = await this._axios.get('/art-collections/my/collections');
			return data;
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