import { UserParams } from "./user";

export interface BookmarkInfo {
  sumOfBookmarks: number,
  bookmarkedUsers: UserParams[],
  pageId: string,
  isBookmarked: boolean,
}

export interface BookmarkParams {
  _id: string,
  page: PageParams | PageParams[],
  user: string,
  createdAt: string,
  __v: number,
}

export interface UserBookmarks {
  userRootBookmarks: BookmarkFolderParams[],
}