import { Page } from "../page"
import { User } from "./user"

export interface GetPageCommentsResponse {
  comments: CommentParams[]
  ok: boolean
}

export interface PostPageCommentParams {
  commentForm: {
    comment: string
    page_id: string;
    replyTo?: string;
    revision_id?: string;
  },
  slackNotificationForm: {
    isSlackEnabled: boolean
    slackChannels: string
  }
}

export interface PutPageCommentParams {
  commentForm: {
    comment: string
    comment_id: string;
    revision_id?: string;
  },
}

export interface PostPageCommentResponse {
  comment: CommentParams
  ok: boolean
}

export interface CommentParams {
  _id?: string
  id?: string
  page?: string | Page
  creator?: User
  revision?: string
  comment?: string
  commentPosition?: number
  createdAt?: string
  updatedAt?: string
  __v?: number
  replyTo?: string | Comment
}
