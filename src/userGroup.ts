import { GROWI } from ".";
import { ChildrenParams, DeleteUserGroupParams, DeleteUserGroupResponse, GetAncestorUserGroupsResponse, GetChildGroupsResponse, GetUserGroupsResponse, GroupsParams, UpdateUserGroupParams, UserGroupParams, UserGroupRootResponse } from "./types/userGroup";

class UserGroup {
	static client: GROWI;

	id?: string;
	name?: string;
	parent?: UserGroup;
	description?: string;
	createdAt?: Date;
	updatedAt?: Date;
	version?: number;
	_ancestors: UserGroup[] = [];
	_children: UserGroup[] = [];
	grandChildren: UserGroup[] = [];

	/**
	 * Constructor
	 * @param data 
	 * @returns 
	 */
	constructor(data?: UserGroupParams) {
		if (!data) return;
		this.sets(data);
	}

	static async root(params: GroupsParams): Promise<UserGroupRootResponse> {
		const json = await this.client.request('GET', '/_api/v3/user-groups', params) as GetUserGroupsResponse;
		return {
			total: json.totalUserGroups,
			groups: json.userGroups.map(params => new UserGroup(params)),
			limit: json.pagingLimit,
		};
	}

	async children(includeGrandChildren: boolean = false): Promise<UserGroup[]> {
		if (this._children.length > 0) return this._children;
		const params = {
			parentIds: [this.id],
			includeGrandChildren,
		} as ChildrenParams;
		const json = await UserGroup.client.request('GET', '/_api/v3/user-groups/children', params) as GetChildGroupsResponse;
		this._children = json.childUserGroups.map(params => new UserGroup(params));
		this.grandChildren = json.grandChildUserGroups.map(params => new UserGroup(params));
		return this._children;
	}

	async ancestors(): Promise<UserGroup[]> {
		if (this._ancestors.length > 0) return this._ancestors;
		const params = {
			groupId: this.id,
		};
		const json = await UserGroup.client.request('GET', '/_api/v3/user-groups/ancestors', params) as GetAncestorUserGroupsResponse;
		this._ancestors = json.ancestorUserGroups.map(params => new UserGroup(params));
		return this._ancestors;
	}

	async save(params: UpdateUserGroupParams = {}): Promise<boolean> {
		return this.id ? this.update(params) : this.create();
	}

	async create(): Promise<boolean> {
		const params = {
			name: this.name,
			description: this.description,
			parentId: this.parent?.id,
		};
		const json = await UserGroup.client.request('POST', '/_api/v3/user-groups', {}, params) as {
			userGroup: UserGroupParams;
		};
		this.sets(json.userGroup);
		return true;
	}

	async update({ forceUpdateParents }: UpdateUserGroupParams = {}): Promise<boolean> {
		const params = {
			name: this.name,
			description: this.description,
			parentId: this.parent?.id,
			forceUpdateParents,
		};
		const json = await UserGroup.client.request('PUT', `/_api/v3/user-groups/${this.id}`, {}, params) as {
			userGroup: UserGroupParams;
		};
		this.sets(json.userGroup);
		return true;
	}

	async get(): Promise<boolean> {
		const json = await UserGroup.client.request('GET', `/_api/v3/user-groups/${this.id}`) as {
			userGroup: UserGroupParams;
		}
		this.sets(json.userGroup);
		return true;
	}

	async delete(params: DeleteUserGroupParams = {}): Promise<boolean> {
		params.actionName = 'delete';
		const json = await UserGroup.client.request('DELETE', `/_api/v3/user-groups/${this.id}`, params) as DeleteUserGroupResponse;
		return true;
	}

	/**
	 * Set userGroup's properties
	 * @param data UserGroupParams
	 * @returns UserGroup
	 */
	sets(data: UserGroupParams): UserGroup {
		Object.entries(data).forEach(([key, value]) => {
			this.set(key, value);
		});
		return this;
	}

	/**
	 * Set user's property
	 * @param key string
	 * @param value any
	 * @returns UserGroup
	 */
	set(key: string, value: any): UserGroup {
		if (!value) return this;
		switch (key) {
			case '_id':
			case 'id':
				this.id = value as string;
				break;
			case 'name':
				this.name = value as string;
				break;
			case 'parent':
				this.parent = new UserGroup();
				this.parent.set('id', value);
				break;
			case 'description':
				this.name = value as string;
				break;
			case 'createdAt':
				this.createdAt = new Date(value as string);
				break;
			case 'updatedAt':
				this.updatedAt = new Date(value as string);
				break;
			case '__v':
				this.version = value as number;
				break;
		}
		return this;
	}
}

export { UserGroup };
