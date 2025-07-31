export interface Tag {
	id: string;
	tagName: string;
	usageCount: number;
	createdAt: string;
	updatedAt: string;
	_count: {
		arts: number;
	};
	description?: string;
	color?: string;
}

export interface TagsResponse {
	tags: Tag[];
	total: number;
	page: number;
	limit: number;
	hasMore: boolean;
}