
interface User {
  id: string;
  email: string;
  username: string;
  profilePicture: string | null;
  artist: any | null;
  wallets?: WalletInfo[];
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
  WalletInfo,
  ApiError,
};
