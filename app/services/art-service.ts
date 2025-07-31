import BaseService from "./base-service";

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

export class ArtService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Create new artwork with image and metadata
   * @param request - The artwork creation request
   * @returns Promise<CreateArtworkResponse>
   */
  async createArtwork(
    request: CreateArtworkRequest
  ): Promise<CreateArtworkResponse> {
    try {
      const formData = new FormData();
      formData.append("title", request.title);
      formData.append("description", request.description);
      formData.append("file", request.file);

      if (request.tagIds && request.tagIds.length > 0) {
        request.tagIds.forEach((tagId) => {
          formData.append("tagIds", tagId);
        });
      }

      const { data } = await this._axios.post("/art", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error: any) {
      console.error("Error creating artwork:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create artwork"
      );
    }
  }

  /**
   * Get artwork by ID
   * @param artworkId - The artwork ID
   * @returns Promise<any>
   */
  async getArtworkById(artworkId: string) {
    try {
      const { data } = await this._axios.get(`/art/${artworkId}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get artwork");
    }
  }

  /**
   * Get artworks by artist
   * @param artistId - The artist ID
   * @returns Promise<any>
   */
  async getArtworksByArtist(artistId: string) {
    try {
      const { data } = await this._axios.get(`/art/artist/${artistId}`);
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to get artworks"
      );
    }
  }

  /**
   * Update artwork
   * @param artworkId - The artwork ID
   * @param updateData - The update data
   * @returns Promise<any>
   */
  async updateArtwork(
    artworkId: string,
    updateData: Partial<CreateArtworkRequest>
  ) {
    try {
      const formData = new FormData();

      if (updateData.title) formData.append("title", updateData.title);
      if (updateData.description)
        formData.append("description", updateData.description);
      if (updateData.file) formData.append("file", updateData.file);
      if (updateData.tagIds && updateData.tagIds.length > 0) {
        updateData.tagIds.forEach((tagId) => {
          formData.append("tagIds", tagId);
        });
      }

      const { data } = await this._axios.put(`/art/${artworkId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update artwork"
      );
    }
  }

  /**
   * Delete artwork
   * @param artworkId - The artwork ID
   * @returns Promise<void>
   */
  async deleteArtwork(artworkId: string): Promise<void> {
    try {
      await this._axios.delete(`/art/${artworkId}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete artwork"
      );
    }
  }

  /**
   * Search artworks by title or description
   * @param query - Search keyword
   * @param page - Page number
   * @param limit - Items per page
   */
  async searchArtworks(query: string, page = 1, limit = 20) {
    try {
      const response = await this._axios.get("/search", {
        params: { q: query, page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to search artworks"
      );
    }
  }
}

export const artService = new ArtService();
