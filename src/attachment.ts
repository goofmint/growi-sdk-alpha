import { GROWI, Page, User } from ".";
import { AttachmentParams, ListAttachmentResponse, ListAttachmentsResult, PostAttachmentResponse } from "./types/attachment";
import FormData from 'form-data';

class Attachment {
	static client: GROWI;

	id?: string;
	__v?: number;
	fileFormat?: string;
	fileName?: string;
	originalName?: string;
	creator?: User;
	page?: Page;
	createdAt?: Date;
	fileSize?: number;
	url?: string;
	filePathProxied?: string;
	downloadPathProxied?: string;
	attachmentType?: string;

	/**
	 * Constructor
	 * @param data 
	 * @returns 
	 */
	constructor(data?: AttachmentParams) {
		if (!data) return;
		this.sets(data);
	}

	/**
	 * Set attachment's properties
	 * @param data 
	 */
	sets(data: AttachmentParams): Attachment {
		Object.entries(data).forEach(([key, value]) => {
			this.set(key, value);
		});
		return this;
	}

	/**
	 * Set attachment's property
	 * @param key 
	 * @param value 
	 * @returns Page
	 */
	set(key: string, value: any): Attachment {
		if (!value) return this;
		switch (key) {
			case '_id':
			case 'id':
				this.id = value as string;
				break;
			case '__v':
				this.__v = value as number;
				break;
			case 'fileFormat':
				this.fileFormat = value as string;
				break;
			case 'fileName':
				this.fileName = value as string;
				break;
			case 'originalName':
				this.originalName = value as string;
				break;
			case 'creator':
				if (value instanceof User) {
					this.creator = value;
				} else if (typeof value == 'object') {
					this.creator = new User(value);
				} else if (typeof value == 'string') {
					this.creator = new User({ _id: value });
				}
				break;
			case 'page':
				if (value instanceof Page) {
					this.page = value;
				} else if (typeof value == 'object') {
					this.page = new Page(value);
				} else if (typeof value == 'string') {
					this.page = new Page({ _id: value });
				}
				break;
			case 'createdAt':
				this.createdAt = new Date(value);
				break;
			case 'fileSize':
				this.fileSize = value as number;
				break;
			case 'url':
				this.url = value as string;
				break;
			case 'filePathProxied':
				this.filePathProxied = value as string;
				break;
			case 'downloadPathProxied':
				this.downloadPathProxied = value as string;
				break;
			case 'attachmentType':
				this.attachmentType = value as string;
				break;
			default:
				throw new Error(`Unknown key in Attachment: ${key}, ${value}`);
		}
		return this;
	}

	static async upload(page: Page, file: Buffer, fileName: string): Promise<Attachment> {
		const formData = new FormData();
		formData.append('file',file, fileName);
		formData.append('page_id', page.id!);
		const res = await this.client.request('POST', '/_api/v3/attachment', {}, formData) as PostAttachmentResponse;
		const attachment = new Attachment(res.attachment);
		if (res.page) attachment.page = new Page(res.page);
		return attachment;
	}

	static async find(id: string): Promise<Attachment> {
		const res = await Attachment.client.request('GET', `/_api/v3/attachment/${id}`, {}) as PostAttachmentResponse;
		return new Attachment(res.attachment);
	}

	static async list(page: Page, pageNumber: number = 1, limit: number = 10): Promise<ListAttachmentsResult> {
		const params = { pageId: page.id, limit, pageNumber };
		const { paginateResult } = await this.client.request('GET', '/_api/v3/attachment/list', params) as ListAttachmentResponse;
		const {docs, ...result } = paginateResult;
		(result as ListAttachmentsResult).attachments = docs.map((a) => new Attachment(a));
		return result;
	}

	static async limit(fileSize: number): Promise<boolean> {
		const params = { fileSize };
		const res = await this.client.request('GET', '/_api/v3/attachment/limit', params) as { isUploadable: boolean };
		return res.isUploadable;
	}
}

export { Attachment };

