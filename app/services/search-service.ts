import BaseService from "./base-service";
import type { SearchResponse } from "../types/search";

class SearchService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Search across all content types (arts, collections, artists)
   * @param query - Search query string (cannot be empty)
   * @returns Promise<SearchResponse>
   */
  async search(query: string): Promise<SearchResponse> {
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }

    try {
      const { data } = await this._axios.get<SearchResponse>('/search', {
        params: { q: query.trim() }
      });
      return data;
    } catch (error: any) {
      console.error('Error searching:', error);
      throw new Error(error.response?.data?.message || 'Failed to search');
    }
  }
}

export const searchService = new SearchService();
