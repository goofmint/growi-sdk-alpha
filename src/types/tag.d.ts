import { PagePamams } from "./page";

export interface TagParams {
	tag: string;
	page: string | Page;
}

export interface UpdatePageTagResponse {
	savedPage: Page
	tags: string[]
	ok: boolean
}
