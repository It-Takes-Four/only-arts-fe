export interface PurchasedCollection {
  id: string;
  collectionName: string;
  description: string | null;
  coverImageFileId: string;
  price: string;
  tokenId: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  artistId: string;
  artist: {
    id: string;
    artistName: string;
    isVerified: boolean;
    user: {
      username: string;
      profilePictureFileId: string | null;
    };
  };
  artsCount: number;
}

export interface PurchasedCollectionsPagination {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PurchasedCollectionsResponse {
  data: PurchasedCollection[];
  pagination: PurchasedCollectionsPagination;
}
