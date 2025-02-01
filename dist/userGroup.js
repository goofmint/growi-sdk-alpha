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
exports.UserGroup = void 0;
class UserGroup {
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data) {
        this._ancestors = [];
        this._children = [];
        this.grandChildren = [];
        if (!data)
            return;
        this.sets(data);
    }
    static root(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.client.request('GET', '/_api/v3/user-groups', params);
            return {
                total: json.totalUserGroups,
                groups: json.userGroups.map(params => new UserGroup(params)),
                limit: json.pagingLimit,
            };
        });
    }
    children() {
        return __awaiter(this, arguments, void 0, function* (includeGrandChildren = false) {
            if (this._children.length > 0)
                return this._children;
            const params = {
                parentIds: [this.id],
                includeGrandChildren,
            };
            const json = yield UserGroup.client.request('GET', '/_api/v3/user-groups/children', params);
            this._children = json.childUserGroups.map(params => new UserGroup(params));
            this.grandChildren = json.grandChildUserGroups.map(params => new UserGroup(params));
            return this._children;
        });
    }
    ancestors() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._ancestors.length > 0)
                return this._ancestors;
            const params = {
                groupId: this.id,
            };
            const json = yield UserGroup.client.request('GET', '/_api/v3/user-groups/ancestors', params);
            this._ancestors = json.ancestorUserGroups.map(params => new UserGroup(params));
            return this._ancestors;
        });
    }
    save() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            return this.id ? this.update(params) : this.create();
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const params = {
                name: this.name,
                description: this.description,
                parentId: (_a = this.parent) === null || _a === void 0 ? void 0 : _a.id,
            };
            const json = yield UserGroup.client.request('POST', '/_api/v3/user-groups', {}, params);
            this.sets(json.userGroup);
            return true;
        });
    }
    update() {
        return __awaiter(this, arguments, void 0, function* ({ forceUpdateParents } = {}) {
            var _a;
            const params = {
                name: this.name,
                description: this.description,
                parentId: (_a = this.parent) === null || _a === void 0 ? void 0 : _a.id,
                forceUpdateParents,
            };
            const json = yield UserGroup.client.request('PUT', `/_api/v3/user-groups/${this.id}`, {}, params);
            this.sets(json.userGroup);
            return true;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield UserGroup.client.request('GET', `/_api/v3/user-groups/${this.id}`);
            this.sets(json.userGroup);
            return true;
        });
    }
    delete() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            params.actionName = 'delete';
            const json = yield UserGroup.client.request('DELETE', `/_api/v3/user-groups/${this.id}`, params);
            return true;
        });
    }
    /**
     * Set userGroup's properties
     * @param data UserGroupParams
     * @returns UserGroup
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
     * @returns UserGroup
     */
    set(key, value) {
        if (!value)
            return this;
        switch (key) {
            case '_id':
            case 'id':
                this.id = value;
                break;
            case 'name':
                this.name = value;
                break;
            case 'parent':
                this.parent = new UserGroup();
                this.parent.set('id', value);
                break;
            case 'description':
                this.name = value;
                break;
            case 'createdAt':
                this.createdAt = new Date(value);
                break;
            case 'updatedAt':
                this.updatedAt = new Date(value);
                break;
            case '__v':
                this.version = value;
                break;
        }
        return this;
    }
}
exports.UserGroup = UserGroup;
