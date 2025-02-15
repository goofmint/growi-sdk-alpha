import { UserParams } from './user';

export interface PageParams {
  _id?: string;
  parent?: string | Page;
  descendantCount?: number;
  isEmpty?: boolean;
  status?: string;
  grant?: number;
  grantedUsers?: string[] | UserParams[];
  liker?: string[] | UserParams[];
  seenUsers?: string[] | UserParams[];
  commentCount?: number;
  grantedGroups?: any[];
  updatedAt?: string;
  path?: string;
  createdAt?: string;
  __v?: number;
  lastUpdateUser?: string | UserParams;
  latestRevisionBodyLength?: number;
  revision?: string | Revision;
  id?: string;
	seenUserCount?: number;
}


export interface createPageParams {
	name: string;
	grant?: number;
	grantUserGroupIds?: string[];
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

export interface PageTagResponse {
	tags: string[];
	ok: boolean;
}