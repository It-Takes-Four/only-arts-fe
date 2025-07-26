// User and Authentication Models

interface Artist {
  id: string;
  artistName: string;
  bio: string | null;
  isNsfw: boolean;
  userId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  profilePicture: string | null;
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

export type {
  User,
  Artist,
  WalletInfo,
  ApiError,
};
