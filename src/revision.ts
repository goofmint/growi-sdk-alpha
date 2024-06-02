import { Page } from "./page";
import { RevisionParams } from "./types/revision";
import { User } from "./user";

class Revision {
  id?: string;
  format?: string;
	page?: Page;
  body?: string;
  author?: User;
  origin?: string;
  hasDiffToPrev?: boolean;
  createdAt?: Date;
  version?: number;

	/**
	 * Constructor
	 * @param data 
	 * @returns 
	 */
	constructor(data?: RevisionParams) {
		if (!data) return;
		this.sets(data);
	}

	/**
	 * Set revision's properties
	 * @param data RevisionParams
	 * @returns Revision 
	 */
	sets(data: RevisionParams): Revision {
		Object.entries(data).forEach(([key, value]) => {
			this.set(key, value);
		});
		return this;
	}

	/**
	 * Set revision's property
	 * @param key string
	 * @param value any
	 * @returns Revision
	 */
	set(key: string, value: any): Revision {
		if (!value) return this;
		switch (key) {
			case '_id':
			case 'id':
				this.id = value as string;
				break;
			case 'format':
				this.format = value as string;
				break;
			case 'pageId':
				this.page = new Page();
				this.page.id = value as string;
				break;
			case 'page':
				this.page = value as Page;
				break;
			case 'body':
				this.body = value as string;
				break;
			case 'author':
				if (value instanceof User) {
					this.author = value as User;
				} else if (typeof value === 'string') {
					this.author = new User();
					this.author.id = value;
				}
				break;
			case 'origin':
				this.origin = value as string;
				break;
			case 'hasDiffToPrev':
				this.hasDiffToPrev = value as boolean;
				break;
			case 'createdAt':
				this.createdAt = new Date(value as string);
				break;
			case '__v':
				this.version = value as number;
				break;
			default:
				throw new Error(`Unknown key: ${key}`);
		}
		return this;
	}
}

export { Revision };
