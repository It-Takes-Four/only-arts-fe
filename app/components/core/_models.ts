// User and Authentication Models

interface Artist {
  id: string;
  artistName: string;
  bio: string | null;
  isNsfw: boolean;
  userId: string;
  isVerified: boolean;
  walletAddress: string | null;
  createdAt: string;
  updatedAt?: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  profilePicture: string | null;
  profilePictureFileId: string | null;
  createdAt?: number; // Unix timestamp
  updatedAt?: number; // Unix timestamp
  artist: Artist | null;
  wallets?: WalletInfo[];
  comments?: any[];
  followers?: any[];
  notifications?: any[];
}

interface WalletInfo {
  id: string;
  walletAddress: string;
  isVerified: boolean;
  linkedAt: string;
}

export type YupError = {
    name: string
    message: string
}
interface ApiError {
	message: string | string[];
	error: string;
	statusCode: number;
}

export type EndpointCallResponse = {
    message?: string
    data: string
}

export type EndpointCallResponseMessage = {
    message: string
}

export type AxiosResponse = {
    response: string
}

export type DataResponse<T> = {
    data: T
}

// Art Card Models
interface ArtCardProps {
  art: {
    id: string;
    title: string;
    likes?: number;
    description: string;
    artist: {
      id?: string;
      name: string;
      image?: string;
      profilePicture?: string | null;
      profilePictureFileId?: string | null;
    };
    imageUrl: string | null;
    tags?: Array<{
      name?: string;
      artId?: string;
      tagId?: string;
      tag?: {
        id: string;
        tagName: string;
      }
    }> | Array<{ name: string }>;
    type?: 'post' | 'art' | 'collection';
    createdAt?: string;
  };
}

export type {
  User,
  Artist,
  WalletInfo,
  ApiError,
  ArtCardProps,
};
