import { GROWI, Page, User } from ".";
import { BookmarkParams } from "./types/bookmark";
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
          this.bookmarks = (value as BookmarkParams[]).map((bookmark) => {
            return new Page(bookmark.page);
          });
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

  find(id: string): BookmarkFolder | undefined {
    if (this.id === id) return this;
    for (const folder of (this.childFolders || [])) {
      const found = folder.find(id);
      if (found) return found;
    }
    return;
  }

  async fetch(): Promise<boolean> {
    if (!this.id) return true;
    const folders = await BookmarkFolder.all(this.owner?.id || '');
    for (const f of folders) {
      const folder = f.find(this.id);
      if (folder) {
        this.sets(folder.toParams());
        return true;
      }
    };
    return false;
  }

  async save(): Promise<boolean> {
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
    if (this.parent && !this.parent.id) await this.parent?.save();
    const { bookmarkFolder } = await BookmarkFolder.client.request('PUT', '/_api/v3/bookmark-folder', {}, this.toJson()) as {
      bookmarkFolder: BookmarkFolderParams,
    }
    this.sets(bookmarkFolder);
    return true;
  }

  async remove(): Promise<boolean> {
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

  async addPage(page: Page): Promise<boolean> {
    if (!page.id) throw new Error('Page ID is not defined');
    if (!this.id) await this.save();
    const { bookmarkFolder } = await BookmarkFolder.client.request('POST', '/_api/v3/bookmark-folder/add-boookmark-to-folder', {}, {
      pageId: page.id,
      folderId: this.id,
    }) as { bookmarkFolder: BookmarkFolderParams };
    this.sets(bookmarkFolder);
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

  toParams(): BookmarkFolderParams {
    return {
      _id: this.id!,
      name: this.name!,
      owner: this.owner?.id || '',
      bookmarks: [],
      childFolder: this.childFolders.map((folder) => folder.toParams()),
      parent: this.parent?.id || '',
      __v: this.version!,
    }
  }
}


export { BookmarkFolder };