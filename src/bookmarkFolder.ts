import { GROWI, Page, User } from ".";
import { BookmarkFolderParams, BookmarkFolderUpdateParams } from "./types/bookmarkFolder";
import { PageParams } from "./types/page";

class BookmarkFolder {
	static client: GROWI;

  id?: string;
  name?: string;
  owner?: User;
  bookmarks: Page[] = [];
  childFolders: BookmarkFolder[] = [];
  parent?: BookmarkFolder;
  version?: number;

	/**
	 * Constructor
	 * @param data 
	 * @returns 
	 */
	constructor(data?: BookmarkFolderParams) {
		if (!data) return;
		this.sets(data);
	}

	/**
	 * Set bookmark folder's properties
	 * @param data BookmarkFolderParams
	 * @returns BookmarkFolder
	 */
	sets(data: BookmarkFolderParams): BookmarkFolder {
		Object.entries(data).forEach(([key, value]) => {
			this.set(key, value);
		});
		return this;
	}

	/**
	 * Set bookmark folder's property
	 * @param key string
	 * @param value any
	 * @returns BookmarkFolder
	 */
	set(key: string, value: any): BookmarkFolder {
    switch (key) {
      case '_id':
      case 'id':
        this.id = value as string;
        break;
      case '__v':
        this.version = value as number;
        break;
      case 'name':
        this.name = value as string;
        break;
      case 'owner':
        this.owner = new User();
        this.owner.id = value as string;
        break;
      case 'bookmarks':
        if (value instanceof Page) {
          this.bookmarks = [value];
        } else if (value instanceof Array) {
          this.bookmarks = (value as PageParams[]).map((bookmark) => new Page(bookmark));
        }
        break;
      case 'childFolder':
        if (value instanceof BookmarkFolder) {
          this.childFolders = [value];
        } else if (value instanceof Array) {
          this.childFolders = (value as BookmarkFolderParams[]).map((folder) => new BookmarkFolder(folder));
        }
        break;
      case 'parent':
        this.parent = new BookmarkFolder();
        this.parent.id = value as string;
        break;
    }
    return this;
  }

  static async all(userId: string): Promise<BookmarkFolder[]> {
    const { bookmarkFolderItems } = await this.client.request('GET', `/_api/v3/bookmark-folder/list/${userId}`) as { bookmarkFolderItems: BookmarkFolderParams[] };
    return bookmarkFolderItems.map((folder) => new BookmarkFolder(folder));
  }

  save(): Promise<boolean> {
    if (this.id) {
      return this.update();
    } else {
      return this.create();
    }
  }

  async create(): Promise<boolean> {
    const params = {
      name: this.name,
      parent: this.parent?.id,
    };
    const { bookmarkFolder } = await BookmarkFolder.client.request('POST', '/_api/v3/bookmark-folder', {}, params) as {
      bookmarkFolder: BookmarkFolderParams,
    }
    this.sets(bookmarkFolder);
    return true;
  }

  async update(): Promise<boolean> {
    const { bookmarkFolder } = await BookmarkFolder.client.request('PUT', '/_api/v3/bookmark-folder', {}, this.toJson()) as {
      bookmarkFolder: BookmarkFolderParams,
    }
    this.sets(bookmarkFolder);
    return true;
  }

  async delete(): Promise<boolean> {
    if (!this.id) return false;
    const { deletedCount } = await BookmarkFolder.client.request('DELETE', `/_api/v3/bookmark-folder/${this.id}`) as { deletedCount: number };
    return deletedCount > 0;
  }

  async addFolder(folder: BookmarkFolder): Promise<boolean> {
    const ary: Promise<boolean>[] = [];
    if (!this.id) ary.push(this.save());
    if (!folder.id) ary.push(folder.save());
    await Promise.all(ary);
    folder.parent = this;
    await folder.save();
    return true;
  }

  toJson(): BookmarkFolderUpdateParams {
    if (!this.id) throw new Error('BookmarkFolder ID is not defined');
    if (!this.name) throw new Error('BookmarkFolder name is not defined');
    return {
      bookmarkFolderId: this.id,
      name: this.name,
      childFolder: [],
      parent: this.parent?.id || '',
    }
  }
}


export { BookmarkFolder };