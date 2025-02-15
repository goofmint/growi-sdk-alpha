/// <reference types="node" />
import { Attachment, GROWI } from ".";
import { Revision } from "./revision";
import { PageParams, createPageParams, removePageParams, updatePageParams } from "./types/page";
import { User } from "./user";
import { Comment } from "./comment";
interface PageBookmarkInfo {
    bookmarkCount: number;
    users: User[];
    bookmarked: boolean;
}
declare class Page {
    static client: GROWI;
    static Revision: typeof Revision;
    static Grant: {
        readonly public: 1;
        readonly restricted: 2;
        readonly specified: 3;
        readonly owner: 4;
        readonly userGroup: 5;
    };
    id?: string;
    path?: string;
    parent?: Page;
    descendantCount?: number;
    isEmpty?: boolean;
    status?: string;
    grant?: number;
    grantedUsers?: string[];
    liker?: string[];
    seenUsers?: string[];
    commentCount?: number;
    grantedGroups?: string[];
    updatedAt?: Date;
    createdAt?: Date;
    revision?: Revision;
    latestRevisionBodyLength?: number;
    lastUpdateUser?: User;
    version?: number;
    creator?: User;
    wip?: boolean;
    ttlTimestamp?: Date;
    _tags?: string[];
    _comments?: Comment[];
    body?: string;
    seenUserCount?: number;
    _bookmarkInfo?: PageBookmarkInfo;
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data?: PageParams);
    /**
     * Set page's properties
     * @param data
     */
    sets(data: PageParams): Page;
    /**
     * Set page's property
     * @param key
     * @param value
     * @returns Page
     */
    set(key: string, value: any): Page;
    /**
     * Get children pages of this page
     * @returns Page[]
     */
    children(): Promise<Page[]>;
    /**
     * Get page detail
     * @returns boolean
     */
    get(): Promise<boolean>;
    contents(contents?: string): Promise<string>;
    /**
     * Create new page
     * @param params createPageParams
     * @returns Page
     */
    create(params: createPageParams): Promise<Page>;
    /**
     * Update page content
     * @param params updatePageParams
     * @returns boolean
     */
    save(params?: updatePageParams): Promise<boolean>;
    /**
     * Remove page
     * @param params removePageParams
     * @returns
     */
    remove(params?: removePageParams): Promise<boolean>;
    tags(): Promise<string[]>;
    updateTag(action: string, text: string): Promise<string[]>;
    addTag(text: string): Promise<string[]>;
    removeTag(text: string): Promise<string[]>;
    bookmarkInfo(): Promise<PageBookmarkInfo>;
    bookmarked(): Promise<boolean>;
    bookmarkCount(): Promise<number>;
    bookmarkUsers(): Promise<User[]>;
    comments(): Promise<Comment[]>;
    comment(): Comment;
    upload(fileName: string, file: Buffer): Promise<Attachment>;
}
export { Page };
