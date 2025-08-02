// Search result types based on API response structure

export interface SearchArtTag {
  tagId: string;
  tagName: string;
}

export interface SearchArtist {
  id: string;
  artistName: string;
  isVerified: boolean;
  totalFollowers: number;
  totalArts: number;
  totalCollections: number;
  bio: string;
  user: {
    username: string;
    profilePictureFileId: string | null;
  };
}

export interface SearchArt {
  id: string;
  title: string;
  description: string;
  imageFileId: string;
  datePosted: string;
  likesCount: number;
  artist: SearchArtist;
  tags: SearchArtTag[];
}

export interface SearchCollection {
  id: string;
  collectionName: string;
  description: string;
  coverImageFileId: string;
  price: string;
  isPublished: boolean;
  isPurchased?: boolean;
  createdAt: string;
  artist: SearchArtist;
  artsCount: number;
}

export interface SearchResponse {
  arts: SearchArt[];
  collections: SearchCollection[];
  artists: SearchArtist[];
}

export type SearchResultType = 'all' | 'arts' | 'collections' | 'artists';
