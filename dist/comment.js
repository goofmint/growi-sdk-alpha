"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const _1 = require(".");
const revision_1 = require("./revision");
const user_1 = require("./user");
class Comment {
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data) {
        if (!data)
            return;
        this.sets(data);
    }
    /**
     * Set user's properties
     * @param data CommentParams
     * @returns User
     */
    sets(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
        return this;
    }
    /**
     * Set comment's property
     * @param key string
     * @param value any
     * @returns Comment
     */
    set(key, value) {
        if (!value)
            return this;
        switch (key) {
            case '_id':
            case 'id':
                this.id = value;
                break;
            case 'page':
                if (value instanceof _1.Page) {
                    this.page = value;
                }
                else if (value) {
                    this.page = new _1.Page();
                    this.page.id = value;
                }
                break;
            case 'creator':
                if (value instanceof user_1.User) {
                    this.creator = value;
                }
                else if (typeof value === 'object') {
                    this.creator = new user_1.User(value);
                }
                else if (typeof value === 'string') {
                    this.creator = new user_1.User();
                    this.creator.id = value;
                }
                break;
            case 'revision':
                if (value instanceof revision_1.Revision) {
                    this.revision = value;
                    this.set('body', this.revision.body);
                }
                else if (typeof value === 'object') {
                    this.revision = new revision_1.Revision(value);
                }
                else if (typeof value === 'string' && !this.revision) {
                    this.revision = new revision_1.Revision({ id: value });
                }
                break;
            case 'comment':
                this.comment = value;
                break;
            case 'commentPosition':
                this.commentPosition = value;
                break;
            case 'createdAt':
                this.createdAt = new Date(value);
                break;
            case 'updatedAt':
                this.updatedAt = new Date(value);
                break;
            case '__v':
                this.__v = value;
                break;
            case 'replyTo':
                if (value instanceof Comment) {
                    this.replyTo = value;
                }
                else if (typeof value === 'object') {
                    this.replyTo = new Comment(value);
                }
                else if (typeof value === 'string') {
                    this.replyTo = new Comment({ id: value, page: this.page });
                }
                break;
            case 'isSlackEnabled':
                this.isSlackEnabled = value;
                break;
            case 'slackChannels':
                this.slackChannels = value;
                break;
            default:
                throw new Error(`Unknown key in comment: ${key}`);
        }
        return this;
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!page.id)
                throw new Error('Page ID is not defined');
            const res = yield Comment.client.request('GET', '/_api/comments.get', { page_id: page.id });
            return res.comments.map((comment) => new Comment(Object.assign(Object.assign({}, comment), { page })));
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.id ? this.update() : this.create();
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const params = {
                commentForm: {
                    comment: this.comment,
                    page_id: (_a = this.page) === null || _a === void 0 ? void 0 : _a.id,
                },
                slackNotificationForm: {
                    isSlackEnabled: this.isSlackEnabled || false,
                    slackChannels: this.slackChannels || '',
                }
            };
            if ((_b = this.replyTo) === null || _b === void 0 ? void 0 : _b.id)
                params.commentForm.replyTo = this.replyTo.id;
            if (!((_c = this.page) === null || _c === void 0 ? void 0 : _c.revision)) {
                yield ((_d = this.page) === null || _d === void 0 ? void 0 : _d.get());
            }
            params.commentForm.revision_id = (_f = (_e = this.page) === null || _e === void 0 ? void 0 : _e.revision) === null || _f === void 0 ? void 0 : _f.id;
            const res = yield Comment.client.request('POST', '/_api/comments.add', {}, params);
            this.sets(res.comment);
            return res.ok;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const params = {
                commentForm: {
                    comment: this.comment,
                    comment_id: this.id,
                    revision_id: (_a = this.revision) === null || _a === void 0 ? void 0 : _a.id,
                },
            };
            const res = yield Comment.client.request('POST', '/_api/comments.update', {}, params);
            return res.ok;
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                comment_id: this.id,
            };
            const res = yield Comment.client.request('POST', '/_api/comments.remove', {}, params);
            return res.ok;
        });
    }
}
exports.Comment = Comment;
