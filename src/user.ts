import { Growi } from ".";
import { UserParams } from "./types/user";

class User {
	static client: Growi;

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
	imageUrlCached?: string;

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
			case 'imageUrlCached':
				this.imageUrlCached = value as string;
				break;
			default:
				throw new Error(`Unknown key: ${key}`);
		}
		return this;
	}
}

export { User };