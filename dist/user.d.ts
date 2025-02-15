import { BookmarkFolder, GROWI, Page } from ".";
import { UserParams } from "./types/user";
declare class User {
    static client: GROWI;
    id?: string;
    isGravatarEnabled?: boolean;
    isEmailPublished?: boolean;
    lang?: string;
    status?: number;
    admin?: boolean;
    name?: string;
    username?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    imageUrlCached?: string;
    isQuestionnaireEnabled?: boolean;
    readonly?: boolean;
    isInvitationEmailSended?: boolean;
    version?: number;
    lastLoginAt?: Date;
    _bookmarkFolders: BookmarkFolder[];
    _bookmarks: Page[];
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data?: UserParams);
    /**
     * Set user's properties
     * @param data UserParams
     * @returns User
     */
    sets(data: UserParams): User;
    /**
     * Set user's property
     * @param key string
     * @param value any
     * @returns User
     */
    set(key: string, value: any): User;
    static me(): Promise<User>;
    bookmarks(): Promise<Page[]>;
    bookmark(page: Page, bool?: boolean): Promise<boolean>;
    isBookmarked(page: Page): Promise<boolean>;
    bookmarkFolders(): Promise<BookmarkFolder[]>;
}
export { User };
