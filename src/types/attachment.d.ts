export interface AttachmentParams {
	_id: string,
	__v: number,
	fileFormat: string,
	fileName: string,
	originalName: string,
	creator: UserParams,
	page: string,
	createdAt: string,
	fileSize: number,
	url: string,
	filePathProxied: string,
	downloadPathProxied: string,
	attachmentType: string,
}

export interface ListAttachmentResponse {
	paginateResult: {
		docs: AttachmentParams[],
		totalDocs: number,
		offset: number,
		limit: number,
		totalPages: number,
		page: number,
		pagingCounter: number,
		hasPrevPage: boolean,
		hasNextPage: boolean,
		prevPage: number | null,
		nextPage: number | null,
	}
}

export interface ListAttachmentsResult {
	attachments?: Attachment[],
	totalDocs: number,
	offset: number,
	limit: number,
	totalPages: number,
	page: number,
	pagingCounter: number,
	hasPrevPage: boolean,
	hasNextPage: boolean,
	prevPage: number | null,
	nextPage: number | null,
}

export interface PostAttachmentResponse {
	page: PagePamams | undefined,
	attachment: AttachmentParams,
	url: string,
	pageCreated: boolean,
}
