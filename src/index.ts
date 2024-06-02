import axios from "axios";
import { Page } from "./page";
import { GrowiInitParams, HttpMethod } from "./types/client";
import { PagePamams } from "./types/page";
import { User } from "./user";
import { Revision } from "./revision";

class Growi {
	private _apiToken?: string;
	private _url: string;
	private _path: string;
	Page = Page;
	User = User;
	Revision = Revision;

	/**
	 * Constructor
	 * @param params GrowiInitParams
	 */
	constructor(params: GrowiInitParams) {
		this._apiToken = params.apiToken;
		this._url = params.url || 'http://localhost:3000'
		this._path = params.path || '';
		Page.client = this;
	}

	async root(): Promise<Page> {
		const json = await this.request('GET', '/_api/v3/page-listing/root') as {
			rootPage: PagePamams,
		};
		return new Page(json.rootPage);
	}

	async request(
		method: HttpMethod,
		path: string,
		queries: {[key: string]: any} = {},
		body: {[key: string]: any} = {}
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

	async post(url: string, params: {[key: string]: any}, body: {[key: string]: any}): Promise<any> {
		const headers = {
			'Accept': 'application/json',
		};
		const u = `${url}?access_token=${encodeURIComponent(params.access_token)}`;
		const response = await axios.post(u, body);
		if (response.status !== 201 && response.status !== 200) {
			throw new Error(`Failed to post request: ${response.statusText}`);
		}
		return response.data;
	}

	async put(url: string, params: {[key: string]: any}, body: {[key: string]: any}): Promise<any> {
		const headers = {
			'Accept': 'application/json',
		};
		const u = `${url}?access_token=${encodeURIComponent(params.access_token)}`;
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
		const u = `${url}?access_token=${encodeURIComponent(params.access_token)}`;
		const response = await axios.delete(u, body);
		if (response.status !== 200) {
			throw new Error(`Failed to delete request: ${response.statusText}`);
		}
		return response.data;
	}
}

export { Growi, Page };