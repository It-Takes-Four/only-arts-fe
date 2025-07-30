import BaseService from "./base-service";

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

export class FeedService extends BaseService {
  constructor() {
    super();
  }

  // New unified feed endpoint for home page
  async getUnifiedFeeds(page: number = 1, limit: number = 10, tagId?: string): Promise<UnifiedFeedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (tagId) {
        params.append('tagId', tagId);
      }
      
      const { data } = await this._axios.get<UnifiedFeedResponse>(`/feeds?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching unified feeds:', error);
      throw error;
    }
  }

  // Legacy method for explore page
  async getFeeds(page: number = 1, limit: number = 10, tagId?: string): Promise<FeedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (tagId) {
        params.append('tagId', tagId);
      }
      
      const { data } = await this._axios.get<FeedResponse>(`/explore?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching feeds:', error);
      throw error;
    }
  }
}

export const feedService = new FeedService();
