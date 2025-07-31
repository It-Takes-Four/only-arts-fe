import BaseService from "./base-service";
import type { FeedResponse, UnifiedFeedResponse } from "../types/feed";

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
