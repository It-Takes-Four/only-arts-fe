export interface CreateArtworkRequest {
	title: string;
	description: string;
	tagIds?: string[];
	file: File;
}

export interface CreateArtworkResponse {
	id: string;
	title: string;
	description: string;
	imageFileId: string;
	artistId: string;
	tags?: Array<{
		id: string;
		tagName: string;
	}>;
	createdAt: string;
}

// Artist Artwork Types
export interface ArtworkTag {
	tagId: string;
	tagName: string;
}

export interface ArtworkComment {
	id: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
	artId: string;
}

export interface ArtworkCollection {
	id: string;
	collectionId: string;
	artId: string;
}

export interface ArtistArtwork {
	id: string;
	tokenId: string;
	title: string;
	description: string;
	imageFileId: string;
	datePosted: string;
	updatedAt: string;
	artistId: string;
	artist: {
		id: string;
		artistName: string;
		isVerified: boolean;
		user: {
			profilePictureFileId: string | null;
		};
	};
	tags: ArtworkTag[];
	collections: ArtworkCollection[];
	comments: ArtworkComment[];
}

export interface ArtistArtworksResponse {
	data: ArtistArtwork[];
	pagination: {
		currentPage: number;
		perPage: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

export interface MyArtwork {
	id: string;
	tokenId: string;
	title: string;
	isLiked: boolean;
	likesCount?: number;
	description: string;
	imageFileId: string;
	datePosted: string;
	updatedAt: string;
	artistId: string;
	artist: {
		id: string;
		artistName: string;
		isVerified: boolean;
		user: {
			profilePictureFileId: string | null;
		};
	};
	tags: Array<{
		tagId: string;
		tagName: string;
	}>;
	collections: Array<{
		id: string;
		collectionId: string;
		artId: string;
	}>;
	comments: Array<{
		id: string;
		content: string;
		createdAt: string;
		updatedAt: string;
		userId: string;
		artId: string;
	}>;
}

export interface MyArtworksResponse {
	data: MyArtwork[];
	pagination: {
		currentPage: number;
		perPage: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}