/**
 * Model definitions for explore page data structures
 */

export interface ExploreTag {
  id: string;
  tagName: string;
}

export interface ExploreArtwork {
  id: string;
  title: string;
  description: string;
  imageFileId: string;
  datePosted: string;
  likesCount: number;
  isInACollection: boolean;
  artistId: string;
  artistName: string;
  artistProfileFileId: string | null;
  tags: ExploreTag[];
}

export interface ExploreResponse {
  data: ExploreArtwork[];
  total: number;
  page: number;
  limit: number;
}

export interface ExploreFilters {
  tagId?: string;
  page?: number;
  limit?: number;
}
