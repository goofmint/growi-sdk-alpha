import { Attachment, GROWI } from ".";
import { Revision } from "./revision";
import { GetPageCommentsResponse } from "./types/comment";
import { PagePamams, PageTagResponse, createPageParams, removePageParams, removePageRequest, removePageResponse, updatePageParams, updatePageRequest } from "./types/page";
import { RevisionParams } from "./types/revision";
import { User } from "./user";
import { Comment } from "./comment";
import { UpdatePageTagResponse } from "./types/tag";
import fs from 'fs';
import path from 'path';

const PageGrant = {
	public: 1,
	restricted: 2,
	specified: 3,
	owner: 4,
	userGroup: 5,
} as const;

class Page {
	static client: GROWI;
	static Revision = Revision;
	static Grant = PageGrant;

	id?: string;
	path?: string;
	parent?: Page;
	descendantCount?: number;
	isEmpty?: boolean;
	status?: string;
	grant?: number;
	grantedUsers?: string[];
	liker?: string[];
	seenUsers?: string[];
	commentCount?: number;
	grantedGroups?: string[];
	updatedAt?: Date;
	createdAt?: Date;
	revision?: Revision;
	latestRevisionBodyLength?: number;
	lastUpdateUser?: User;
	version?: number;
	creator?: User;
	wip?: boolean;
	ttlTimestamp?: Date;
	_tags?: string[];
	_comments?: Comment[];
	body?: string;
	seenUserCount?: number;

	/**
	 * Constructor
	 * @param data 
	 * @returns 
	 */
	constructor(data?: PagePamams) {
		if (!data) return;
		this.sets(data);
	}

	/**
	 * Set page's properties
	 * @param data 
	 */
	sets(data: PagePamams): Page {
		Object.entries(data).forEach(([key, value]) => {
			this.set(key, value);
		});
		return this;
	}

	/**
	 * Set page's property
	 * @param key 
	 * @param value 
	 * @returns Page
	 */
	set(key: string, value: any): Page {
		if (!value) return this;
		switch (key) {
			case '_id':
			case 'id':
				this.id = value as string;
				break;
			case 'path':
				this.path = value as string;
				break;
			case 'parent':
				if (value instanceof Page) {
					this.parent = value;
				} else if (value) {
					this.parent = new Page();
					this.parent.id = value as string;
				}
				break;
			case 'descendantCount':
				this.descendantCount = value as number;
				break;
			case 'isEmpty':
				this.isEmpty = value as boolean;
				break;
			case 'status':
				this.status = value as string;
				break;
			case 'grant':
				this.grant = value as number;
				break;
			case 'grantedUsers':
				this.grantedUsers = value as string[];
				break;
			case 'liker':
				this.liker = value as string[];
				break;
			case 'seenUsers':
				this.seenUsers = value as string[];
				break;
			case 'commentCount':
				this.commentCount = value as number;
				break;
			case 'grantedGroups':
				this.grantedGroups = value as string[];
				break;
			case 'updatedAt':
				this.updatedAt = new Date(value as string);
				break;
			case 'createdAt':
				this.createdAt = new Date(value as string);
				break;
			case 'revision':
				if (value instanceof Revision) {
					this.revision = value;
					this.revision.page = this;
					this.set('body', this.revision.body);
				} else if (typeof value === 'object') {
					this.revision = new Revision({...value as RevisionParams, ...{page: this}});
					this.set('body', this.revision.body);
				} else if (typeof value === 'string' && !this.revision) {
					this.revision = new Revision({ id: value });
				}
				break;
			case 'tags':
				if (Array.isArray(value)) {
					this._tags = value as string[];
				}
				break;
			case 'latestRevisionBodyLength':
				this.latestRevisionBodyLength = value as number;
				break;
			case 'lastUpdateUser':
				if (value instanceof User) {
					this.lastUpdateUser = value;
				} else if (typeof value === 'object') {
					this.lastUpdateUser = new User(value);
				} else if (typeof value === 'string') {
					this.lastUpdateUser = new User();
					this.lastUpdateUser.id = value;
				}
				break;
			case '__v':
				this.version = value as number;
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
			case 'wip':
				this.wip = value as boolean;
				break;
			case 'ttlTimestamp':
				this.ttlTimestamp = new Date(value as string);
				break;
			case 'body':
				this.body = value as string;
				break;
			case 'seenUserCount':
				this.seenUserCount = value as number;
				break;
			default:
				throw new Error(`Unknown key in page: ${key}`);
		}
		return this;
	}

	/**
	 * Get children pages of this page
	 * @returns Page[]
	 */
	async children(): Promise<Page[]> {
		const json = await Page.client.request('GET', '/_api/v3/page-listing/children', {
			id: this.id,
		}) as {
			children: PagePamams[],
		};
		if (!json.children) throw new Error('Failed to get children pages');
		return json.children.map((data) => new Page({...data, parent: this}));
	}

	/**
	 * Get page detail
	 * @returns boolean
	 */
	async get(): Promise<boolean> {
		const { page } = await Page.client.request('GET', '/_api/v3/page', {
			pageId: this.id,
		}) as {
			page: PagePamams,
		};
		if (!page) return false;
		this.sets(page);
		return true;
	}

	async contents(contents?: string): Promise<string> {
		if (contents) {
			this.body = contents;
			return contents;
		}
		if (this.revision && this.revision.body) return this.revision.body;
		if (!this.id) throw new Error('Page ID is not defined');
		await this.get();
		return this.revision?.body || '';
	}

	/**
	 * Create new page
	 * @param params createPageParams
	 * @returns Page
	 */
	async create(params: createPageParams): Promise<Page> {
		const path = this.parent ? `${this.path}/${params.name}` : `/${params.name}`;
		const { page, revision, tags } = await Page.client.request('POST', '/_api/v3/page', {}, {
			path,
			grant: params.grant || PageGrant.public,
			body: params.body || '',
		}) as {
			page: PagePamams,
			revision: RevisionParams,
			tags: string[],
		}
		return new Page(page)
			.set('revision', revision)
			.set('tags', tags);
	}

	/**
	 * Update page content
	 * @param params updatePageParams
	 * @returns boolean
	 */
	async save(params: updatePageParams = {}): Promise<boolean> {
		if (!this.id) throw new Error('Page ID is not defined');
		if (!this.revision) await this.get();
		if (!this.revision) throw new Error('Failed to get revision');
		const body = {
			pageId: this.id,
			revisionId: this.revision!.id,
			body: this.body,
		} as updatePageRequest;
		if (params.grant) body.grant = params.grant;
		if (params.userRelatedGrantUserGroupIds) body.userRelatedGrantUserGroupIds = params.userRelatedGrantUserGroupIds;
		if (params.overwriteScopesOfDescendants) body.overwriteScopesOfDescendants = params.overwriteScopesOfDescendants;
		if (params.isSlackEnabled) body.isSlackEnabled = params.isSlackEnabled;
		if (params.slackChannels) body.slackChannels = params.slackChannels;
		if (params.origin) body.origin = params.origin;
		if (params.wip) body.wip = params.wip;
		const { page } = await Page.client.request('PUT', '/_api/v3/page', {}, body) as {
			page: PagePamams,
		}
		this.sets(page);
		return true;
	}

	/**
	 * Remove page
	 * @param params removePageParams
	 * @returns 
	 */
	async remove(params?: removePageParams): Promise<boolean> {
		if (!this.revision) await this.get();
			const body = {
			pageIdToRevisionIdMap: {
				[this.id!]: this.revision!.id,
			},
		} as removePageRequest;
		if (params?.isCompletely) body.isCompletely = true;
		if (params?.isRecursively) body.isRecursively = true;
		const res = await Page.client.request('POST', '/_api/v3/pages/delete', {}, body) as removePageResponse;
		return (res.paths.includes(this.path!));
	}

	async tags(): Promise<string[]> {
		if (!this.id) throw new Error('Page ID is not defined');
		if (this._tags && this._tags.length > 0) return this._tags;
		const params = {
			pageId: this.id,
		};
		const res = await Page.client.request('GET', '/_api/pages.getPageTag', params) as PageTagResponse;
		this._tags = res.tags.map(tag => tag);
		return this._tags;
	}

	async updateTag(action: string, text: string): Promise<string[]> {
		if (!this.id) throw new Error('Page ID is not defined');
		if (!this._tags) await this.tags();
		const params = {
			pageId: this.id,
			revisionId: this.revision?.id,
			tags: this._tags || [],
		};
		if (action === 'add') {
			params.tags.push(text);
		} else if (action === 'remove') {
			params.tags = params.tags.filter(tag => tag !== text);
		} else {
			throw new Error(`Unknown tag action: ${action}`);
		}
		const res = await Page.client.request('POST', '/_api/tags.update', {}, params) as UpdatePageTagResponse;
		this._tags = res.tags.map(tag => tag);
		return this._tags;
	}

	async addTag(text: string): Promise<string[]> {
		return this.updateTag('add', text);
	}

	async removeTag(text: string): Promise<string[]> {
		return this.updateTag('remove', text);
	}

	async comments(): Promise<Comment[]> {
		if (!this.id) throw new Error('Page ID is not defined');
		if (this._comments && this._comments.length > 0) return this._comments;
		this._comments = await Comment.all(this);
		return this._comments;
	}

	comment(): Comment {
		return new Comment({ page: this });
	}

	async upload(filePath: string | Buffer, fileName?: string): Promise<Attachment> {
		if (typeof filePath === 'string' && !fs.existsSync(filePath)) throw new Error('File not found');
		if (filePath instanceof Buffer && !fileName) throw new Error('File name is required');
		const f = typeof filePath === 'string' ? fs.readFileSync(filePath) : filePath;
		const attachment = await Attachment.upload(this, f, fileName || path.basename(filePath as string));
		attachment.page = this;
		return attachment;
	}
}

export { Page };
