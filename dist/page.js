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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const _1 = require(".");
const revision_1 = require("./revision");
const user_1 = require("./user");
const comment_1 = require("./comment");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PageGrant = {
    public: 1,
    restricted: 2,
    specified: 3,
    owner: 4,
    userGroup: 5,
};
class Page {
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
     * Set page's properties
     * @param data
     */
    sets(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
        return this;
    }
    /**
     * Set page's property
     * @param key
     * @param value
     * @returns Page
     */
    set(key, value) {
        if (!value)
            return this;
        switch (key) {
            case '_id':
            case 'id':
                this.id = value;
                break;
            case 'path':
                this.path = value;
                break;
            case 'parent':
                if (value instanceof Page) {
                    this.parent = value;
                }
                else if (value) {
                    this.parent = new Page();
                    this.parent.id = value;
                }
                break;
            case 'descendantCount':
                this.descendantCount = value;
                break;
            case 'isEmpty':
                this.isEmpty = value;
                break;
            case 'status':
                this.status = value;
                break;
            case 'grant':
                this.grant = value;
                break;
            case 'grantedUsers':
                this.grantedUsers = value;
                break;
            case 'liker':
                this.liker = value;
                break;
            case 'seenUsers':
                this.seenUsers = value;
                break;
            case 'commentCount':
                this.commentCount = value;
                break;
            case 'grantedGroups':
                this.grantedGroups = value;
                break;
            case 'updatedAt':
                this.updatedAt = new Date(value);
                break;
            case 'createdAt':
                this.createdAt = new Date(value);
                break;
            case 'revision':
                if (value instanceof revision_1.Revision) {
                    this.revision = value;
                    this.revision.page = this;
                    this.set('body', this.revision.body);
                }
                else if (typeof value === 'object') {
                    this.revision = new revision_1.Revision(Object.assign(Object.assign({}, value), { page: this }));
                    this.set('body', this.revision.body);
                }
                else if (typeof value === 'string' && !this.revision) {
                    this.revision = new revision_1.Revision({ id: value });
                }
                break;
            case 'tags':
                if (Array.isArray(value)) {
                    this._tags = value;
                }
                break;
            case 'latestRevisionBodyLength':
                this.latestRevisionBodyLength = value;
                break;
            case 'lastUpdateUser':
                if (value instanceof user_1.User) {
                    this.lastUpdateUser = value;
                }
                else if (typeof value === 'object') {
                    this.lastUpdateUser = new user_1.User(value);
                }
                else if (typeof value === 'string') {
                    this.lastUpdateUser = new user_1.User();
                    this.lastUpdateUser.id = value;
                }
                break;
            case '__v':
                this.version = value;
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
            case 'wip':
                this.wip = value;
                break;
            case 'ttlTimestamp':
                this.ttlTimestamp = new Date(value);
                break;
            case 'body':
                this.body = value;
                break;
            case 'seenUserCount':
                this.seenUserCount = value;
                break;
            default:
                throw new Error(`Unknown key in page: ${key}`);
        }
        return this;
    }
    /**
     * Get children pages of this page
     * @returns Page[]
     */
    children() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield Page.client.request('GET', '/_api/v3/page-listing/children', {
                id: this.id,
            });
            if (!json.children)
                throw new Error('Failed to get children pages');
            return json.children.map((data) => new Page(Object.assign(Object.assign({}, data), { parent: this })));
        });
    }
    /**
     * Get page detail
     * @returns boolean
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = yield Page.client.request('GET', '/_api/v3/page', {
                pageId: this.id,
            });
            if (!page)
                return false;
            this.sets(page);
            return true;
        });
    }
    contents(contents) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (contents) {
                this.body = contents;
                return contents;
            }
            if (this.revision && this.revision.body)
                return this.revision.body;
            if (!this.id)
                throw new Error('Page ID is not defined');
            yield this.get();
            return ((_a = this.revision) === null || _a === void 0 ? void 0 : _a.body) || '';
        });
    }
    /**
     * Create new page
     * @param params createPageParams
     * @returns Page
     */
    create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.parent ? `${this.path}/${params.name}` : `/${params.name}`;
            const { page, revision, tags } = yield Page.client.request('POST', '/_api/v3/page', {}, {
                path,
                grant: params.grant || PageGrant.public,
                body: params.body || '',
            });
            return new Page(page)
                .set('revision', revision)
                .set('tags', tags);
        });
    }
    /**
     * Update page content
     * @param params updatePageParams
     * @returns boolean
     */
    save() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            if (!this.id)
                throw new Error('Page ID is not defined');
            if (!this.revision)
                yield this.get();
            if (!this.revision)
                throw new Error('Failed to get revision');
            const body = {
                pageId: this.id,
                revisionId: this.revision.id,
                body: this.body,
            };
            if (params.grant)
                body.grant = params.grant;
            if (params.userRelatedGrantUserGroupIds)
                body.userRelatedGrantUserGroupIds = params.userRelatedGrantUserGroupIds;
            if (params.overwriteScopesOfDescendants)
                body.overwriteScopesOfDescendants = params.overwriteScopesOfDescendants;
            if (params.isSlackEnabled)
                body.isSlackEnabled = params.isSlackEnabled;
            if (params.slackChannels)
                body.slackChannels = params.slackChannels;
            if (params.origin)
                body.origin = params.origin;
            if (params.wip)
                body.wip = params.wip;
            const { page } = yield Page.client.request('PUT', '/_api/v3/page', {}, body);
            this.sets(page);
            return true;
        });
    }
    /**
     * Remove page
     * @param params removePageParams
     * @returns
     */
    remove(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.revision)
                yield this.get();
            const body = {
                pageIdToRevisionIdMap: {
                    [this.id]: this.revision.id,
                },
            };
            if (params === null || params === void 0 ? void 0 : params.isCompletely)
                body.isCompletely = true;
            if (params === null || params === void 0 ? void 0 : params.isRecursively)
                body.isRecursively = true;
            const res = yield Page.client.request('POST', '/_api/v3/pages/delete', {}, body);
            return (res.paths.includes(this.path));
        });
    }
    tags() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw new Error('Page ID is not defined');
            if (this._tags && this._tags.length > 0)
                return this._tags;
            const params = {
                pageId: this.id,
            };
            const res = yield Page.client.request('GET', '/_api/pages.getPageTag', params);
            this._tags = res.tags.map(tag => tag);
            return this._tags;
        });
    }
    updateTag(action, text) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.id)
                throw new Error('Page ID is not defined');
            if (!this._tags)
                yield this.tags();
            const params = {
                pageId: this.id,
                revisionId: (_a = this.revision) === null || _a === void 0 ? void 0 : _a.id,
                tags: this._tags || [],
            };
            if (action === 'add') {
                params.tags.push(text);
            }
            else if (action === 'remove') {
                params.tags = params.tags.filter(tag => tag !== text);
            }
            else {
                throw new Error(`Unknown tag action: ${action}`);
            }
            const res = yield Page.client.request('POST', '/_api/tags.update', {}, params);
            this._tags = res.tags.map(tag => tag);
            return this._tags;
        });
    }
    addTag(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateTag('add', text);
        });
    }
    removeTag(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateTag('remove', text);
        });
    }
    bookmarkInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw new Error('Page ID is not defined');
            const res = yield Page.client.request('GET', '/_api/v3/bookmarks/info', { pageId: this.id });
            this._bookmarkInfo = {
                bookmarkCount: res.sumOfBookmarks,
                users: res.bookmarkedUsers.map((user) => new user_1.User(user)),
                bookmarked: res.isBookmarked,
            };
            return this._bookmarkInfo;
        });
    }
    bookmarked() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.id)
                throw new Error('Page ID is not defined');
            if (!this._bookmarkInfo)
                yield this.bookmarkInfo();
            return ((_a = this._bookmarkInfo) === null || _a === void 0 ? void 0 : _a.bookmarked) || false;
        });
    }
    bookmarkCount() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.id)
                throw new Error('Page ID is not defined');
            if (!this._bookmarkInfo)
                yield this.bookmarkInfo();
            return ((_a = this._bookmarkInfo) === null || _a === void 0 ? void 0 : _a.bookmarkCount) || 0;
        });
    }
    bookmarkUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.id)
                throw new Error('Page ID is not defined');
            if (!this._bookmarkInfo)
                yield this.bookmarkInfo();
            return ((_a = this._bookmarkInfo) === null || _a === void 0 ? void 0 : _a.users) || [];
        });
    }
    comments() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                throw new Error('Page ID is not defined');
            if (this._comments && this._comments.length > 0)
                return this._comments;
            this._comments = yield comment_1.Comment.all(this);
            return this._comments;
        });
    }
    comment() {
        return new comment_1.Comment({ page: this });
    }
    upload(filePath, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof filePath === 'string' && !fs_1.default.existsSync(filePath))
                throw new Error('File not found');
            if (filePath instanceof Buffer && !fileName)
                throw new Error('File name is required');
            const f = typeof filePath === 'string' ? fs_1.default.readFileSync(filePath) : filePath;
            const attachment = yield _1.Attachment.upload(this, f, fileName || path_1.default.basename(filePath));
            attachment.page = this;
            return attachment;
        });
    }
}
exports.Page = Page;
Page.Revision = revision_1.Revision;
Page.Grant = PageGrant;
