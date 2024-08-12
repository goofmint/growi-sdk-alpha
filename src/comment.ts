import { GROWI, Page } from ".";
import { Revision } from "./revision";
import { CommentParams, GetPageCommentsResponse, PostPageCommentParams, PostPageCommentResponse, PutPageCommentParams } from "./types/comment";
import { RevisionParams } from "./types/revision";
import { User } from "./user";

class Comment {
	static client: GROWI;
	id?: string;
	page?: Page;
	creator?: User;
	revision?: Revision;
	comment?: string;
	commentPosition?: number;
	createdAt?: Date;
	updatedAt?: Date;
	replyTo?: Comment;
	__v?: number;
	isSlackEnabled?: boolean;
	slackChannels?: string[];

	/**
	 * Constructor
	 * @param data 
	 * @returns 
	 */
	constructor(data?: CommentParams) {
		if (!data) return;
		this.sets(data);
	}

	/**
	 * Set user's properties
	 * @param data CommentParams
	 * @returns User
	 */
	sets(data: CommentParams): Comment {
		Object.entries(data).forEach(([key, value]) => {
			this.set(key, value);
		});
		return this;
	}

	/**
	 * Set comment's property
	 * @param key string
	 * @param value any
	 * @returns Comment
	 */
	set(key: string, value: any): Comment {
		if (!value) return this;
		switch (key) {
			case '_id':
			case 'id':
				this.id = value as string;
				break;
			case 'page':
				if (value instanceof Page) {
					this.page = value;
				} else if (value) {
					this.page = new Page();
					this.page.id = value as string;
				}
				break;
			case 'creator':
				if (value instanceof User) {
					this.creator = value;
				} else if (typeof value === 'object') {
					this.creator = new User(value);
				} else if (typeof value === 'string') {
					this.creator = new User();
					this.creator.id = value;
				}
				break;
			case 'revision':
				if (value instanceof Revision) {
					this.revision = value;
					this.set('body', this.revision.body);
				} else if (typeof value === 'object') {
					this.revision = new Revision(value as RevisionParams);
				} else if (typeof value === 'string' && !this.revision) {
					this.revision = new Revision({ id: value });
				}
				break;
			case 'comment':
				this.comment = value as string;
				break;
			case 'commentPosition':
				this.commentPosition = value as number;
				break;
			case 'createdAt':
				this.createdAt = new Date(value);
				break;
			case 'updatedAt':
				this.updatedAt = new Date(value);
				break;
			case '__v':
				this.__v = value as number;
				break;
			case 'replyTo':
				if (value instanceof Comment) {
					this.replyTo = value;
				} else if (typeof value === 'object') {
					this.replyTo = new Comment(value as CommentParams);
				} else if (typeof value === 'string') {
					this.replyTo = new Comment({ id: value, page: this.page });
				}
				break;
			case 'isSlackEnabled':
				this.isSlackEnabled = value as boolean;
				break;
			case 'slackChannels':
				this.slackChannels = value as string[];
				break;
			default:
				throw new Error(`Unknown key in comment: ${key}`);
		}
		return this;
	}

	static async all(page: Page): Promise<Comment[]> {
		if (!page.id) throw new Error('Page ID is not defined');
		const res = await Comment.client.request('GET', '/_api/comments.get', { page_id: page.id }) as GetPageCommentsResponse;
		return res.comments.map((comment) => new Comment({...comment, ...{page}}));
	}

	async save(): Promise<boolean> {
		return this.id ? this.update() : this.create();
	}

	async create(): Promise<boolean> {
		const params = {
			commentForm: {
				comment: this.comment,
				page_id: this.page?.id,
			},
			slackNotificationForm: {
				isSlackEnabled: this.isSlackEnabled || false,
				slackChannels: this.slackChannels || '',
			}
		} as PostPageCommentParams;
		if (this.replyTo?.id) params.commentForm.replyTo = this.replyTo.id;
		if (!this.page?.revision) {
			await this.page?.get();
		}
		params.commentForm.revision_id = this.page?.revision?.id;
		const res = await Comment.client.request('POST', '/_api/comments.add', {}, params) as PostPageCommentResponse;
		this.sets(res.comment);
		return res.ok;
	}

	async update(): Promise<boolean> {
		const params = {
			commentForm: {
				comment: this.comment,
				comment_id: this.id,
				revision_id: this.revision?.id,
			},
		} as PutPageCommentParams;
		const res = await Comment.client.request('POST', '/_api/comments.update', {}, params) as PostPageCommentResponse;
		return res.ok;
	}

	async remove(): Promise<boolean> {
		const params = {
			comment_id: this.id,
		};
		const res = await Comment.client.request('POST', '/_api/comments.remove', {}, params) as PostPageCommentResponse;
		return res.ok;
	}
}

export { Comment };