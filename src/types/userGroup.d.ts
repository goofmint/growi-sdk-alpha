
export interface UserGroupParams {
	_id: string;
  name: string;
  parent: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetUserGroupsResponse {
	userGroups: UserGroupParams[],
	totalUserGroups: number;
	pagingLimit: number;
}

export interface GetAncestorUserGroupsResponse {
	ancestorUserGroups: UserGroupParams[],
}

export interface DeleteUserGroupParams {
	actionName?: string;
	transferToUserGroupId?: string;
	transferToUserGroupType?: string;
}

export interface DeleteUserGroupResponse {
	userGroups: {
		acknowledged: boolean;
		deletedCount: number;
	};
}

export interface UpdateUserGroupParams {
	forceUpdateParents?: boolean;
}

export interface UserGroupRootResponse {
	groups: UserGroup[],
	total: number;
	limit: number;
}

export interface GroupsParams {
	page?: number;
	limit?: number;
	offset?: number;
	pagination?: boolean;
}

export interface ChildrenParams {
	parentIds: string[];
	includeGrandChildren?: boolean;
}

export interface GetChildGroupsResponse {
	childUserGroups: UserGroupParams[];
	grandChildUserGroups: UserGroupParams[];
}
