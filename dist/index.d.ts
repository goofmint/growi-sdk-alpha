import { Page } from "./page";
import { GrowiInitParams, HttpMethod, SearchParams, SearchResult } from "./types/client";
import { User } from "./user";
import { Revision } from "./revision";
import { Comment } from "./comment";
import { Attachment } from "./attachment";
import { BookmarkFolder } from "./bookmarkFolder";
import { UserGroup } from "./userGroup";
import { GroupsParams, UserGroupRootResponse } from "./types/userGroup";
declare class GROWI {
    private _apiToken?;
    private _url;
    private _path;
    Page: typeof Page;
    User: typeof User;
    Revision: typeof Revision;
    Comment: typeof Comment;
    _currentUser?: User;
    /**
     * Constructor
     * @param params GrowiInitParams
     */
    constructor(params: GrowiInitParams);
    root(): Promise<Page>;
    page(params: {
        pageId?: string;
        path?: string;
    }): Promise<Page>;
    currentUser(): Promise<User>;
    groups(params?: GroupsParams): Promise<UserGroupRootResponse>;
    search(params: SearchParams): Promise<SearchResult>;
    searchByTag(tag: string): Promise<SearchResult>;
    request(method: HttpMethod, path: string, queries?: {
        [key: string]: any;
    }, body?: {
        [key: string]: any;
    } | FormData): Promise<any>;
    get(url: string, params: {
        [key: string]: any;
    }): Promise<any>;
    post(url: string, params: {
        [key: string]: any;
    }, body: {
        [key: string]: any;
    } | FormData): Promise<any>;
    put(url: string, params: {
        [key: string]: any;
    }, body: {
        [key: string]: any;
    } | FormData): Promise<any>;
    delete(url: string, params: {
        [key: string]: any;
    }, body: {
        [key: string]: any;
    }): Promise<any>;
}
export { GROWI, Page, Comment, Revision, User, Attachment, UserGroup, BookmarkFolder, };
