import axios from "axios";
import { Page } from "./page";
import { GrowiInitParams, HttpMethod } from "./types/client";
import { PagePamams } from "./types/page";

class Growi {
	private _apiToken: string;
	private _url: string;
	private _path: string;
	Page = Page;

	/**
	 * Constructor
	 * @param params GrowiInitParams
	 */
	constructor(params: GrowiInitParams) {
		this._apiToken = params.apiToken;
		this._url = params.url || 'http://localhost:3000'
		this._path = params.path || '/_api/v3';
		Page.client = this;
	}

	async root(): Promise<Page> {
		const json = await this.request('GET', '/page-listing/root') as {
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
		const response = await axios.get(`${this._url}${this._path}${path}`, {
			params: {...queries, access_token: this._apiToken},
			headers: {
				'Accept': 'application/json',
			}
		});
		if (response.status !== 200 && response.status !== 201) {
			throw new Error(`Failed to get page: ${response.statusText}`);
		}
		return response.data;
	}
}

export { Growi, Page };