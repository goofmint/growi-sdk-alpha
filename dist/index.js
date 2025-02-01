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
exports.BookmarkFolder = exports.UserGroup = exports.Attachment = exports.User = exports.Revision = exports.Comment = exports.Page = exports.GROWI = void 0;
const axios_1 = __importDefault(require("axios"));
const page_1 = require("./page");
Object.defineProperty(exports, "Page", { enumerable: true, get: function () { return page_1.Page; } });
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const revision_1 = require("./revision");
Object.defineProperty(exports, "Revision", { enumerable: true, get: function () { return revision_1.Revision; } });
const comment_1 = require("./comment");
Object.defineProperty(exports, "Comment", { enumerable: true, get: function () { return comment_1.Comment; } });
const attachment_1 = require("./attachment");
Object.defineProperty(exports, "Attachment", { enumerable: true, get: function () { return attachment_1.Attachment; } });
const bookmarkFolder_1 = require("./bookmarkFolder");
Object.defineProperty(exports, "BookmarkFolder", { enumerable: true, get: function () { return bookmarkFolder_1.BookmarkFolder; } });
const userGroup_1 = require("./userGroup");
Object.defineProperty(exports, "UserGroup", { enumerable: true, get: function () { return userGroup_1.UserGroup; } });
class GROWI {
    /**
     * Constructor
     * @param params GrowiInitParams
     */
    constructor(params) {
        this.Page = page_1.Page;
        this.User = user_1.User;
        this.Revision = revision_1.Revision;
        this.Comment = comment_1.Comment;
        this._apiToken = params.apiToken;
        this._url = params.url || 'http://localhost:3000';
        this._path = params.path || '';
        page_1.Page.client = this;
        comment_1.Comment.client = this;
        user_1.User.client = this;
        attachment_1.Attachment.client = this;
        userGroup_1.UserGroup.client = this;
        bookmarkFolder_1.BookmarkFolder.client = this;
    }
    root() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rootPage: page } = yield this.request('GET', '/_api/v3/page-listing/root');
            return new page_1.Page(page);
        });
    }
    page(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.request('GET', '/_api/v3/page', params);
            return new page_1.Page(json.page);
        });
    }
    currentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._currentUser) {
                this._currentUser = yield this.User.me();
            }
            if (!this._currentUser) {
                throw new Error('Failed to get current user');
            }
            return this._currentUser;
        });
    }
    groups() {
        return __awaiter(this, arguments, void 0, function* (params = { pagination: false }) {
            return userGroup_1.UserGroup.root(params);
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { meta, data } = yield this.request('GET', '/_api/search', params);
            return Object.assign(Object.assign({}, meta), { pages: data.map((d) => new page_1.Page(d.data)) });
        });
    }
    searchByTag(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.search({ q: `tag:${tag}` });
        });
    }
    request(method_1, path_1) {
        return __awaiter(this, arguments, void 0, function* (method, path, queries = {}, body = {}) {
            const url = `${this._url}${this._path}${path}`;
            const params = queries || {};
            if (this._apiToken) {
                params.access_token = this._apiToken;
            }
            switch (method.toUpperCase()) {
                case 'GET':
                    return this.get(url, params);
                case 'POST':
                    return this.post(url, params, body);
                case 'PUT':
                    return this.put(url, params, body);
                case 'DELETE':
                    return this.delete(url, params, body);
            }
            throw new Error(`Unsupported http method ${method}`);
        });
    }
    get(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Accept': 'application/json',
            };
            const response = yield axios_1.default.get(url, { params, headers });
            if (response.status !== 200) {
                throw new Error(`Failed to get request: ${response.statusText}`);
            }
            return response.data;
        });
    }
    post(url, params, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = body instanceof FormData ? {} : {
                'Accept': 'application/json',
            };
            const u = params.access_token ? `${url}?access_token=${encodeURIComponent(params.access_token)}` : url;
            const response = yield axios_1.default.post(u, body, { headers });
            if (response.status !== 201 && response.status !== 200) {
                throw new Error(`Failed to post request: ${response.statusText}`);
            }
            return response.data;
        });
    }
    put(url, params, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Accept': 'application/json',
            };
            const u = params.access_token ? `${url}?access_token=${encodeURIComponent(params.access_token)}` : url;
            const response = yield axios_1.default.put(u, body);
            if (response.status !== 201 && response.status !== 200) {
                throw new Error(`Failed to post request: ${response.statusText}`);
            }
            return response.data;
        });
    }
    delete(url, params, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Accept': 'application/json',
            };
            const response = yield axios_1.default.delete(url, { params, headers });
            if (response.status !== 200) {
                throw new Error(`Failed to delete request: ${response.statusText}`);
            }
            return response.data;
        });
    }
}
exports.GROWI = GROWI;
