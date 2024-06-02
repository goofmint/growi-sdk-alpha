export interface RevisionParams {
	id?: string
  _id?: string
  format?: string
  pageId?: string
  body?: string
  author?: User
  origin?: string
  hasDiffToPrev?: boolean
  createdAt?: string
  __v?: number
}
