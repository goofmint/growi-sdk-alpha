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
exports.User = void 0;
const _1 = require(".");
class User {
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data) {
        this._bookmarkFolders = [];
        this._bookmarks = [];
        if (!data)
            return;
        this.sets(data);
    }
    /**
     * Set user's properties
     * @param data UserParams
     * @returns User
     */
    sets(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
        return this;
    }
    /**
     * Set user's property
     * @param key string
     * @param value any
     * @returns User
     */
    set(key, value) {
        if (!value)
            return this;
        switch (key) {
            case '_id':
            case 'id':
                this.id = value;
                break;
            case 'isGravatarEnabled':
                this.isGravatarEnabled = value;
                break;
            case 'isEmailPublished':
                this.isEmailPublished = value;
                break;
            case 'lang':
                this.lang = value;
                break;
            case 'status':
                this.status = value;
                break;
            case 'admin':
                this.admin = value;
                break;
            case 'name':
                this.name = value;
                break;
            case 'username':
                this.username = value;
                break;
            case 'email':
                this.email = value;
                break;
            case 'createdAt':
                this.createdAt = new Date(value);
                break;
            case 'updatedAt':
                this.updatedAt = new Date(value);
                break;
            case 'imageUrlCached':
                this.imageUrlCached = value;
                break;
            case 'isQuestionnaireEnabled':
                this.isQuestionnaireEnabled = value;
                break;
            case 'readonly':
                this.readonly = value;
                break;
            case 'isInvitationEmailSended':
                this.isInvitationEmailSended = value;
                break;
            case '__v':
                this.version = value;
                break;
            case 'lastLoginAt':
                this.lastLoginAt = new Date(value);
                break;
            case 'apiToken':
                break;
            default:
                throw new Error(`Unknown key in user: ${key} ${value}`);
        }
        return this;
    }
    static me() {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentUser } = yield this.client.request('GET', '/_api/v3/personal-setting');
            return new User(currentUser);
        });
    }
    bookmarks() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw new Error('User id is required');
            const { userRootBookmarks: bookmarks } = yield User.client.request('GET', `/_api/v3/bookmarks/${this.id}`);
            this._bookmarks = bookmarks.map((bookmark) => new _1.Page(bookmark.page));
            return this._bookmarks;
        });
    }
    bookmark(page_1) {
        return __awaiter(this, arguments, void 0, function* (page, bool = true) {
            if (!this.id)
                throw new Error('User id is required');
            if (!page.id)
                throw new Error('Page id is required');
            yield User.client.request('PUT', '/_api/v3/bookmarks', {}, {
                pageId: page.id,
                bool,
            });
            return true;
        });
    }
    isBookmarked(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw new Error('User id is required');
            if (!page.id)
                throw new Error('Page id is required');
            return page.bookmarked();
        });
    }
    bookmarkFolders() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id) {
                throw new Error('User id is required');
            }
            if (this._bookmarkFolders.length === 0) {
                this._bookmarkFolders = yield _1.BookmarkFolder.all(this.id);
            }
            return this._bookmarkFolders;
        });
    }
}
exports.User = User;
