import { BookmarkFolder, GROWI, Page } from ".";
import { UserBookmarks } from "./types/bookmark";
import { UserParams } from "./types/user";

class User {
	static client: GROWI;

	id?: string;
	isGravatarEnabled?: boolean;
	isEmailPublished?: boolean;
	lang?: string;
	status?: number;
	admin?: boolean;
	name?: string;
	username?: string;
	email?: string;
	createdAt?: Date;
	updatedAt?: Date;
	imageUrlCached?: string;
	isQuestionnaireEnabled?: boolean;
	readonly?: boolean;
	isInvitationEmailSended?: boolean;
	version?: number;
	lastLoginAt?: Date;

	_bookmarkFolders: BookmarkFolder[] = [];
	_bookmarks: Page[] = [];
	
	/**
	 * Constructor
	 * @param data 
	 * @returns 
	 */
	constructor(data?: UserParams) {
		if (!data) return;
		this.sets(data);
	}

	/**
	 * Set user's properties
	 * @param data UserParams
	 * @returns User
	 */
	sets(data: UserParams): User {
		Object.entries(data).forEach(([key, value]) => {
			this.set(key, value);
		});
		return this;
	}

	/**
	 * Set user's property
	 * @param key string
	 * @param value any
	 * @returns User
	 */
	set(key: string, value: any): User {
		if (!value) return this;
		switch (key) {
			case '_id':
			case 'id':
				this.id = value as string;
				break;
			case 'isGravatarEnabled':
				this.isGravatarEnabled = value as boolean;
				break;
			case 'isEmailPublished':
				this.isEmailPublished = value as boolean;
				break;
			case 'lang':
				this.lang = value as string;
				break;
			case 'status':
				this.status = value as number;
				break;
			case 'admin':
				this.admin = value as boolean;
				break;
			case 'name':
				this.name = value as string;
				break;
			case 'username':
				this.username = value as string;
				break;
			case 'email':
				this.email = value as string;
				break;
			case 'createdAt':
				this.createdAt = new Date(value as string);
				break;
			case 'updatedAt':
				this.updatedAt = new Date(value as string);
				break;
			case 'imageUrlCached':
				this.imageUrlCached = value as string;
				break;
			case 'isQuestionnaireEnabled':
				this.isQuestionnaireEnabled = value as boolean;
				break;
			case 'readonly':
				this.readonly = value as boolean;
				break;
			case 'isInvitationEmailSended':
				this.isInvitationEmailSended = value as boolean;
				break;
			case '__v':
				this.version = value as number;
				break;
			case 'lastLoginAt':
				this.lastLoginAt = new Date(value as string);
				break;
			case 'apiToken':
				break;
			default:
				throw new Error(`Unknown key in user: ${key} ${value}`);
		}
		return this;
	}

	static async me(): Promise<User> {
		const { currentUser } = await this.client.request('GET', '/_api/v3/personal-setting') as { currentUser: UserParams };
		return new User(currentUser);
	}

	async bookmarks(): Promise<Page[]> {
		if (!this.id) throw new Error('User id is required');
		const { userRootBookmarks: bookmarks } = await User.client.request('GET', `/_api/v3/bookmarks/${this.id}`) as UserBookmarks;
		this._bookmarks = bookmarks.map((bookmark) => new Page(bookmark.page));
		return this._bookmarks;
	}

	async bookmark(page: Page, bool: boolean = true): Promise<boolean> {
		if (!this.id) throw new Error('User id is required');
		if (!page.id) throw new Error('Page id is required');
		await User.client.request('PUT', '/_api/v3/bookmarks', {}, {
			pageId: page.id,
			bool,
		});
		return true;
	}

	async isBookmarked(page: Page): Promise<boolean> {
		if (!this.id) throw new Error('User id is required');
		if (!page.id) throw new Error('Page id is required');
		return page.bookmarked();
	}

	async bookmarkFolders(): Promise<BookmarkFolder[]> {
		if (!this.id) {
			throw new Error('User id is required');
		}
		if (this._bookmarkFolders.length === 0) {
			this._bookmarkFolders = await BookmarkFolder.all(this.id);
		}
		return this._bookmarkFolders;
	}
}

export { User };