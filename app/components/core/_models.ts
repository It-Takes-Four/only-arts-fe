
interface User {
  UserId: string;
  Username: string;
  Name: string;
  PictureId: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}


export type {
  User,
  LoginRequest,
  LoginResponse,
};
