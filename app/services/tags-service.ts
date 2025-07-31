import BaseService from './base-service';
import type { Tag, TagsResponse } from "../types/tag";

export class TagsService extends BaseService {
  /**
   * Get tags with pagination
   */
  async getTags(page: number = 1, limit: number = 50): Promise<TagsResponse> {
    try {
      const response = await this._axios.get('/tags', {
        params: {
          page,
          limit
        }
      });

      return {
        tags: response.data.tags || [],
        total: response.data.total || 0,
        page: response.data.page || page,
        limit: response.data.limit || limit,
        hasMore: response.data.hasMore || false
      };
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }
  }

  /**
   * Search tags by name
   */
  async searchTags(query: string, limit: number = 20): Promise<Tag[]> {
    try {
      const response = await this._axios.get('/tags/search', {
        params: {
          q: query,
          limit
        }
      });

      return response.data.tags || [];
    } catch (error) {
      console.error('Error searching tags:', error);
      throw new Error('Failed to search tags');
    }
  }

  /**
   * Get popular tags
   */
  async getPopularTags(limit: number = 10, search?: string): Promise<Tag[]> {
    try {
      const params: Record<string, any> = { limit };
      if (search && search.trim()) {
        params.search = search.trim();
      }

      const response = await this._axios.get('/tags/popular', { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      throw new Error('Failed to fetch popular tags');
    }
  }

  /**
   * Get tag by ID
   */
  async getTagById(id: string): Promise<Tag> {
    try {
      const response = await this._axios.get(`/tags/${id}`);
      return response.data.tag;
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw new Error('Failed to fetch tag');
    }
  }
}

// Export singleton instance
export const tagsService = new TagsService();
