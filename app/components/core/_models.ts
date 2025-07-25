
interface User {
  id: string;
  email: string;
  username: string;
  profilePicture: string | null;
  artist: any | null;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}


export type {
  User,
  LoginRequest,
  LoginResponse,
};
