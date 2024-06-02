import { Growi } from ".";
import { PagePamams } from "./types/page";

class Page {
	static client: Growi;

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
	revision?: string;
	latestRevisionBodyLength?: number;
	lastUpdateUser?: string;
	version?: number;

	constructor(data?: PagePamams) {
		if (!data) return;
		this.sets(data);
	}

	sets(data: PagePamams) {
		Object.entries(data).forEach(([key, value]) => {
			this.set(key, value);
		});
	}

	set(key: string, value: any): Page {
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
				this.revision = value as string;
				break;
			case 'latestRevisionBodyLength':
				this.latestRevisionBodyLength = value as number;
				break;
			case 'lastUpdateUser':
				this.lastUpdateUser = value as string;
				break;
			case '__v':
				this.version = value as number;
				break;
			default:
				throw new Error(`Unknown key: ${key}`);
		}
		return this;
	}

	async children(): Promise<Page[]> {
		const json = await Page.client.request('GET', '/page-listing/children', {
			id: this.id,
		}) as {
			children: PagePamams[],
		};
		if (!json.children) throw new Error('Failed to get children pages');
		return json.children.map((data) => new Page({...data, parent: this}));
	}
}

export { Page };
