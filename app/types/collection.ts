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