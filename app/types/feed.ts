// Legacy interface for backwards compatibility with explore
export interface FeedPost {
	id: string;
	artistId: string;
	title: string;
	content: string;
	imageUrl: string | null;
	datePosted: string;
	updatedAt: string;
	artist: {
		id: string;
		user: {
			username: string;
			profilePicture: string;
		};
	};
}

// Tag interface
export interface Tag {
	id: string;
	tagName: string;
}

// New unified feed item structure
export interface FeedPostData {
	artistId: string;
	artistName: string;
	artistProfileFileId: string | null;
	content: string;
	title: string;
	createdDate: string;
}

export interface FeedArtData {
	artistId: string;
	artistName: string;
	artistProfileFileId: string | null;
	artDescription: string;
	imageFileId: string;
	artTitle: string;
	createdDate: string;
	tags?: Tag[];
}

export interface FeedCollectionData {
	artistId: string;
	artistName: string;
	artistProfileFileId: string | null;
	collectionDescription: string;
	coverImageFileId: string;
	collectionTitle: string;
	createdDate: string;
}

export interface UnifiedFeedItem {
	post: FeedPostData | null;
	art: FeedArtData | null;
	collection: FeedCollectionData | null;
	createdDate: string;
	type: 'post' | 'art' | 'collection';
}

export interface UnifiedFeedResponse {
	data: UnifiedFeedItem[];
	total: number;
	page: number;
	limit: number;
}

export interface FeedResponse {
	data: FeedPost[];
	total: number;
	page: number;
	limit: number;
}