export interface ArtCardProps {
	art: {
		id: string;
		title: string;
		description: string;
		artist: {
			id?: string;
			name: string;
			image?: string;
			profilePicture: string | null;
			profilePictureFileId: string | null;
		};
		imageUrl: string | null;
		tags?: { name: string; }[];
		type?: 'post' | 'art' | 'collection';
		createdAt?: Date;
	};
}
