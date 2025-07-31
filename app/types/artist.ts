import type { Artist, User } from "../components/core/_models";

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