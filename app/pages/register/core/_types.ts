export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  username: string;
}

export interface RegisterResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}
