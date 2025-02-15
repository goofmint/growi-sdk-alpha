import axios from "axios";
import { Page } from "./page";
import { GrowiInitParams, HttpMethod, SearchParams, SearchResult, SearchResultResponse } from "./types/client";
import { PageParams } from "./types/page";
import { User } from "./user";
import { Revision } from "./revision";
import { Comment } from "./comment";
import { Attachment } from "./attachment";
import { BookmarkFolder } from "./bookmarkFolder";
import { UserGroup } from "./userGroup";
import { GroupsParams, UserGroupRootResponse } from "./types/userGroup";

class GROWI {
	private _apiToken?: string;
	private _url?: string;
	private _path?: string;
	Page = Page;
	User = User;
	Revision = Revision;
	Comment = Comment;
	_currentUser?: User;

	/**
	 * Constructor
	 * @param params GrowiInitParams
	 */
	constructor(params: GrowiInitParams | undefined) {
		if (params) {
			this._apiToken = params.apiToken;
			this._url = params.url || ''
			this._path = params.path || '';
		} else {
			this._url = '';
			this._path = '';
		}
		Page.client = this;
		Comment.client = this;
		User.client = this;
		Attachment.client = this;
		UserGroup.client = this;
		BookmarkFolder.client = this;
	}

	async root(): Promise<Page> {
		const {rootPage: page} = await this.request('GET', '/_api/v3/page-listing/root') as { rootPage: PageParams }
		return new Page(page);
	}

	async page(params: {pageId?: string, path?: string}): Promise<Page> {
		const json = await this.request('GET', '/_api/v3/page', params) as {
			page: PageParams,
		};
		return new Page(json.page);
	}

	async currentUser(): Promise<User> {
		if (!this._currentUser) {
			this._currentUser = await this.User.me();
		}
		if (!this._currentUser) {
			throw new Error('Failed to get current user');
		}
		return this._currentUser;
	}

	async groups(params: GroupsParams = {pagination: false}): Promise<UserGroupRootResponse> {
		return UserGroup.root(params);
	}

	async search(params: SearchParams): Promise<SearchResult> {
		const { meta, data } = await this.request('GET', '/_api/search', params) as SearchResultResponse;
		return {...meta, pages: data.map((d) => new Page(d.data))};
	}

	async searchByTag(tag: string): Promise<SearchResult> {
		return this.search({ q: `tag:${tag}` });
	}
	
	async request(
		method: HttpMethod,
		path: string,
		queries: {[key: string]: any} = {},
		body: {[key: string]: any} | FormData = {}
	): Promise<any> {
		const url = `${this._url}${this._path}${path}`;
		const params = queries || {};
		if (this._apiToken) {
			params.access_token = this._apiToken;
		}
		switch (method.toUpperCase()) {
			case 'GET':
				return this.get(url, params);
			case 'POST':
				return this.post(url, params, body);
			case 'PUT':
				return this.put(url, params, body);
			case 'DELETE':
				return this.delete(url, params, body);
		}
		throw new Error(`Unsupported http method ${method}`);
	}

	async get(url: string, params: {[key: string]: any}): Promise<any> {
		const headers = {
			'Accept': 'application/json',
		};
		const response = await axios.get(url, { params, headers });
		if (response.status !== 200) {
			throw new Error(`Failed to get request: ${response.statusText}`);
		}
		return response.data;
	}

	async post(url: string, params: {[key: string]: any}, body: {[key: string]: any} | FormData): Promise<any> {
		const headers = body instanceof FormData ? {} : {
			'Accept': 'application/json',
		};
		const u = params.access_token ? `${url}?access_token=${encodeURIComponent(params.access_token)}` : url;
		const response = await axios.post(u, body, { headers });
		if (response.status !== 201 && response.status !== 200) {
			throw new Error(`Failed to post request: ${response.statusText}`);
		}
		return response.data;
	}

	async put(url: string, params: {[key: string]: any}, body: {[key: string]: any} | FormData): Promise<any> {
		const headers = {
			'Accept': 'application/json',
		};
		const u = params.access_token ? `${url}?access_token=${encodeURIComponent(params.access_token)}` : url;
		const response = await axios.put(u, body);
		if (response.status !== 201 && response.status !== 200) {
			throw new Error(`Failed to post request: ${response.statusText}`);
		}
		return response.data;
	}

	async delete(url: string, params: {[key: string]: any}, body: {[key: string]: any}): Promise<any> {
		const headers = {
			'Accept': 'application/json',
		};
		const response = await axios.delete(url, { params, headers });
		if (response.status !== 200) {
			throw new Error(`Failed to delete request: ${response.statusText}`);
		}
		return response.data;
	}
}

export {
	GROWI,
	Page,
	Comment,
	Revision,
	User,
	Attachment,
	UserGroup,
	BookmarkFolder,
};