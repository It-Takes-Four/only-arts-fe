// User and Authentication Models

interface User {
	id: string;
	email: string;
	username: string;
	profilePicture: string | null;
	artist: any | null;
}

interface Artist extends User {
	id: string;
	userId: string;
	name: string;
	bio: string;
	profilePicture: string | null;
	profileBanner: string | null;
	// socialLinks: {
	//   twitter?: string;
	//   instagram?: string;
	//   website?: string;
	// };
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

// Art Models

interface Art {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	artist: Artist;
	createdAt: Date;
}

interface ApiError {
	message: string | string[];
	error: string;
	statusCode: number;
}

export type { User, LoginRequest, LoginResponse, Art, ApiError };
