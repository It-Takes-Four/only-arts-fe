import BaseService from "./base-service";

class CollectionService extends BaseService{

	async getCollectionById(collectionId: string) {
		try {
			const { data } = await this._axios.get(`/art-collections/${collectionId}`);
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to get collection');
		}
	}

	async getMyCollections() {
		try {
			const { data } = await this._axios.get('/art-collections/my/arts');
			return data;
		} catch (error: any) {
			throw new Error(error.response?.data?.message || 'Failed to get my collections');
		}
	}

	// async getCollectionsByArtistId(artistId: string) {
	// 	try {
	// 		const { data } = await this._axios.get(`/artists/${artistId}/collections`);
	// 		return data;
	// 	} catch (error: any) {
	// 		throw new Error(error.response?.data?.message || 'Failed to get collections');
	// 	}
	// }

	async createCollection(artistId: string, collectionData: any) {
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