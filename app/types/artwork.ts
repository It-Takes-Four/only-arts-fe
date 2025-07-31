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

