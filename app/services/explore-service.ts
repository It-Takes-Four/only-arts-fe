import BaseService from "./base-service";
import type { ExploreResponse, ExploreFilters } from "../pages/explore/core/explore-models";

export class ExploreService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Fetch artworks for the explore page
   * @param filters - Optional filters for the explore request
   * @returns Promise<ExploreResponse>
   */
  async getExploreArtworks(filters: ExploreFilters = {}): Promise<ExploreResponse> {
    try {
      const params = new URLSearchParams({
        page: (filters.page || 1).toString(),
        limit: (filters.limit || 10).toString()
      });
      
      if (filters.tagId) {
        params.append('tagId', filters.tagId);
      }
      
      const { data } = await this._axios.get<ExploreResponse>(`/explore?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching explore artworks:', error);
      throw error;
    }
  }

  /**
   * Fetch artworks by specific tag
   * @param tagId - The tag ID to filter by
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Promise<ExploreResponse>
   */
  async getExploreArtworksByTag(tagId: string, page: number = 1, limit: number = 10): Promise<ExploreResponse> {
    return this.getExploreArtworks({ tagId, page, limit });
  }
}

export const exploreService = new ExploreService();
