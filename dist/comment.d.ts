import { GROWI, Page } from ".";
import { Revision } from "./revision";
import { CommentParams } from "./types/comment";
import { User } from "./user";
declare class Comment {
    static client: GROWI;
    id?: string;
    page?: Page;
    creator?: User;
    revision?: Revision;
    comment?: string;
    commentPosition?: number;
    createdAt?: Date;
    updatedAt?: Date;
    replyTo?: Comment;
    __v?: number;
    isSlackEnabled?: boolean;
    slackChannels?: string[];
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data?: CommentParams);
    /**
     * Set user's properties
     * @param data CommentParams
     * @returns User
     */
    sets(data: CommentParams): Comment;
    /**
     * Set comment's property
     * @param key string
     * @param value any
     * @returns Comment
     */
    set(key: string, value: any): Comment;
    static all(page: Page): Promise<Comment[]>;
    save(): Promise<boolean>;
    create(): Promise<boolean>;
    update(): Promise<boolean>;
    remove(): Promise<boolean>;
}
export { Comment };
