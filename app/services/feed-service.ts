import BaseService from "./base-service";

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

  async getFeeds(page: number = 1, limit: number = 10, tagId?: string): Promise<FeedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (tagId) {
        params.append('tagId', tagId);
      }
      
      const { data } = await this._axios.get<FeedResponse>(`/feeds?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching feeds:', error);
      throw error;
    }
  }
}

export const feedService = new FeedService();
