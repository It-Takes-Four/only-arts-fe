import type { Artist, User } from "../components/core/_models";

export interface ArtistProfile {
	createdAt: number;
	updatedAt: number;
	id: string;
	userId: string;
	artistName: string;
	isNsfw: boolean;
	bio: string | null;
	walletAddress: string | null;
	totalFollowers: number;
	totalArts: number;
	totalCollections: number;
	isVerified: boolean;
	user: {
		id: string;
		email: string;
		username: string;
		profilePictureFileId: string | null;
		createdAt: number; // Unix timestamp
		updatedAt: number; // Unix timestamp
	};
}

export interface ArtistRegistrationRequest {
	artistName: string;
	bio?: string;
	isNsfw?: boolean;
}

export interface ArtistRegistrationResponse {
	success: boolean;
	message: string;
	artist: Artist;
	user: User;
}