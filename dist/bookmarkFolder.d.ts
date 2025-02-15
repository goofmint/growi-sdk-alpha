import { GROWI, Page, User } from ".";
import { BookmarkFolderParams, BookmarkFolderUpdateParams } from "./types/bookmarkFolder";
declare class BookmarkFolder {
    static client: GROWI;
    id?: string;
    name?: string;
    owner?: User;
    bookmarks: Page[];
    childFolders: BookmarkFolder[];
    parent?: BookmarkFolder;
    version?: number;
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data?: BookmarkFolderParams);
    /**
     * Set bookmark folder's properties
     * @param data BookmarkFolderParams
     * @returns BookmarkFolder
     */
    sets(data: BookmarkFolderParams): BookmarkFolder;
    /**
     * Set bookmark folder's property
     * @param key string
     * @param value any
     * @returns BookmarkFolder
     */
    set(key: string, value: any): BookmarkFolder;
    static all(userId: string): Promise<BookmarkFolder[]>;
    find(id: string): BookmarkFolder | undefined;
    fetch(): Promise<boolean>;
    save(): Promise<boolean>;
    create(): Promise<boolean>;
    update(): Promise<boolean>;
    remove(): Promise<boolean>;
    addFolder(folder: BookmarkFolder): Promise<boolean>;
    addPage(page: Page): Promise<boolean>;
    toJson(): BookmarkFolderUpdateParams;
    toParams(): BookmarkFolderParams;
}
export { BookmarkFolder };
