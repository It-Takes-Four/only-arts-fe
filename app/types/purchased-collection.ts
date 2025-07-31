export interface PurchasedCollection {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  purchaseDate: string;
  artistId: string;
  artistName: string;
  artistProfilePicture: string | null;
  artworkCount: number;
  isCompleted: boolean;
}

export interface PurchasedCollectionsResponse {
  data: PurchasedCollection[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
