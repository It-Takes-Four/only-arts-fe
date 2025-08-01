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
	artId: string;
	tagId: string;
	tag: {
		id: string;
		tagName: string;
		usageCount: number;
		createdAt: string;
		updatedAt: string;
	};
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
	artId: string;
	collectionId: string;
	addedAt: string;
	updatedAt: string;
}

export interface ArtistArtwork {
	id: string;
	imageFileId: string;
	title: string;
	description: string;
	datePosted: string;
	updatedAt: string;
	artistId: string;
	tokenId: string;
	likesCount: number;
	isInACollection: boolean;
	tags: ArtworkTag[];
	comments: ArtworkComment[];
	collections: ArtworkCollection[];
}

export type ArtistArtworksResponse = ArtistArtwork[];

