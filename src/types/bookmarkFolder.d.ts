import { User } from "../user"
import { PagePamams } from "./page"

export interface BookmarkFolderParams {
  _id: string,
  name: string,
  owner: string,
  __v: number,
  bookmarks: PagePamams[] | string[],
  childFolder?: BookmarkFolderParams[],
  parent?: string | null,
}

export interface BookmarkFolderUpdateParams {
  bookmarkFolderId: string,
  name: string,
  parent: string | null,
  childFolder: BookmarkFolderParams[],
}
