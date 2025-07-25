
interface User {
  id: string;
  email: string;
  username: string;
  profilePicture: string | null;
  artist: any | null;
}

interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

export type {
  User,
  ApiError,
};
