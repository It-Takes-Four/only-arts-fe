import BaseService from "./base-service";
import type { SearchResponse } from "app/types/search";

class SearchService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Search across all content types (non-paginated)
   * @param query - Search query string (cannot be empty)
   * @returns Promise<SearchResponse>
   */
  async searchAll(query: string): Promise<SearchResponse> {
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }

    try {
      const { data } = await this._axios.get<SearchResponse>('/search', {
        params: { q: query.trim() }
      });
      return data;
    } catch (error: any) {
      console.error('Error searching all:', error);
      throw new Error(error.response?.data?.message || 'Failed to search');
    }
  }

  /**
   * Search specific content type with pagination
   * @param query - Search query string (cannot be empty)
   * @param type - Type of content to search ('arts', 'collections', 'artists')
   * @param page - Page number (default: 1)
   * @returns Promise with paginated results
   */
  async searchPaginated(query: string, type: 'arts' | 'collections' | 'artists', page: number = 1) {
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }

    try {
      const { data } = await this._axios.get(`/search/${type}`, {
        params: { 
          q: query.trim(),
          page
        }
      });
      return data;
    } catch (error: any) {
      console.error(`Error searching ${type}:`, error);
      throw new Error(error.response?.data?.message || `Failed to search ${type}`);
    }
  }
}

export const searchService = new SearchService();
