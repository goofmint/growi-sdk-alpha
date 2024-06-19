export interface PagePamams {
  _id: string;
  parent: string | Page | null;
  descendantCount: number;
  isEmpty: boolean;
  status: string;
  grant: number;
  grantedUsers: string[] | User[];
  liker: string[] | User[];
  seenUsers: string[] | User[];
  commentCount: number;
  grantedGroups: any[];
  updatedAt: string;
  path: string;
  createdAt: string;
  __v: number;
  lastUpdateUser: string | User;
  latestRevisionBodyLength: number;
  revision: string | Revision;
  id: string;
}


export interface createPageParams {
	name: string;
	grant?: Page.Grant;
	body?: string;
}

export interface updatePageParams {
	grant?: number;
	userRelatedGrantUserGroupIds?: string[];
	overwriteScopesOfDescendants?: boolean;
	isSlackEnabled?: boolean;
	slackChannels?: string;
	origin?: 'view' | 'editor';
	wip?: boolean;
}

export interface updatePageRequest extends updatePageParams {
	pageId: string;
	revisionId: string;
	body: string;
}

export interface removePageParams {
	isCompletely?: boolean;
	isRecursively?: boolean;
}

export interface removePageRequest {
	isCompletely?: boolean;
	pageIdToRevisionIdMap: {
		[key: string]: string;
	};
	isRecursively?: boolean;
}

export interface removePageResponse {
	paths: string[];
}
