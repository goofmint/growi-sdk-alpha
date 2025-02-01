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
exports.BookmarkFolder = void 0;
const _1 = require(".");
class BookmarkFolder {
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data) {
        this.bookmarks = [];
        this.childFolders = [];
        if (!data)
            return;
        this.sets(data);
    }
    /**
     * Set bookmark folder's properties
     * @param data BookmarkFolderParams
     * @returns BookmarkFolder
     */
    sets(data) {
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
    set(key, value) {
        switch (key) {
            case '_id':
            case 'id':
                this.id = value;
                break;
            case '__v':
                this.version = value;
                break;
            case 'name':
                this.name = value;
                break;
            case 'owner':
                this.owner = new _1.User();
                this.owner.id = value;
                break;
            case 'bookmarks':
                if (value instanceof _1.Page) {
                    this.bookmarks = [value];
                }
                else if (value instanceof Array) {
                    this.bookmarks = value.map((bookmark) => {
                        return new _1.Page(bookmark.page);
                    });
                }
                break;
            case 'childFolder':
                if (value instanceof BookmarkFolder) {
                    this.childFolders = [value];
                }
                else if (value instanceof Array) {
                    this.childFolders = value.map((folder) => new BookmarkFolder(folder));
                }
                break;
            case 'parent':
                this.parent = new BookmarkFolder();
                this.parent.id = value;
                break;
        }
        return this;
    }
    static all(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookmarkFolderItems } = yield this.client.request('GET', `/_api/v3/bookmark-folder/list/${userId}`);
            return bookmarkFolderItems.map((folder) => new BookmarkFolder(folder));
        });
    }
    find(id) {
        if (this.id === id)
            return this;
        for (const folder of (this.childFolders || [])) {
            const found = folder.find(id);
            if (found)
                return found;
        }
        return;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.id)
                return true;
            const folders = yield BookmarkFolder.all(((_a = this.owner) === null || _a === void 0 ? void 0 : _a.id) || '');
            for (const f of folders) {
                const folder = f.find(this.id);
                if (folder) {
                    this.sets(folder.toParams());
                    return true;
                }
            }
            ;
            return false;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id) {
                return this.update();
            }
            else {
                return this.create();
            }
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const params = {
                name: this.name,
                parent: (_a = this.parent) === null || _a === void 0 ? void 0 : _a.id,
            };
            const { bookmarkFolder } = yield BookmarkFolder.client.request('POST', '/_api/v3/bookmark-folder', {}, params);
            this.sets(bookmarkFolder);
            return true;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.parent && !this.parent.id)
                yield ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.save());
            const { bookmarkFolder } = yield BookmarkFolder.client.request('PUT', '/_api/v3/bookmark-folder', {}, this.toJson());
            this.sets(bookmarkFolder);
            return true;
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id)
                return false;
            const { deletedCount } = yield BookmarkFolder.client.request('DELETE', `/_api/v3/bookmark-folder/${this.id}`);
            return deletedCount > 0;
        });
    }
    addFolder(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const ary = [];
            if (!this.id)
                ary.push(this.save());
            if (!folder.id)
                ary.push(folder.save());
            yield Promise.all(ary);
            folder.parent = this;
            yield folder.save();
            return true;
        });
    }
    addPage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!page.id)
                throw new Error('Page ID is not defined');
            if (!this.id)
                yield this.save();
            const { bookmarkFolder } = yield BookmarkFolder.client.request('POST', '/_api/v3/bookmark-folder/add-boookmark-to-folder', {}, {
                pageId: page.id,
                folderId: this.id,
            });
            this.sets(bookmarkFolder);
            return true;
        });
    }
    toJson() {
        var _a;
        if (!this.id)
            throw new Error('BookmarkFolder ID is not defined');
        if (!this.name)
            throw new Error('BookmarkFolder name is not defined');
        return {
            bookmarkFolderId: this.id,
            name: this.name,
            childFolder: [],
            parent: ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.id) || '',
        };
    }
    toParams() {
        var _a, _b;
        return {
            _id: this.id,
            name: this.name,
            owner: ((_a = this.owner) === null || _a === void 0 ? void 0 : _a.id) || '',
            bookmarks: [],
            childFolder: this.childFolders.map((folder) => folder.toParams()),
            parent: ((_b = this.parent) === null || _b === void 0 ? void 0 : _b.id) || '',
            __v: this.version,
        };
    }
}
exports.BookmarkFolder = BookmarkFolder;
