"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Revision = void 0;
const page_1 = require("./page");
const user_1 = require("./user");
class Revision {
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
     * Set revision's properties
     * @param data RevisionParams
     * @returns Revision
     */
    sets(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
        return this;
    }
    /**
     * Set revision's property
     * @param key string
     * @param value any
     * @returns Revision
     */
    set(key, value) {
        if (!value)
            return this;
        switch (key) {
            case '_id':
            case 'id':
                this.id = value;
                break;
            case 'format':
                this.format = value;
                break;
            case 'pageId':
                this.page = new page_1.Page();
                this.page.id = value;
                break;
            case 'page':
                this.page = value;
                break;
            case 'body':
                this.body = value;
                break;
            case 'author':
                if (value instanceof user_1.User) {
                    this.author = value;
                }
                else if (typeof value === 'string') {
                    this.author = new user_1.User();
                    this.author.id = value;
                }
                break;
            case 'origin':
                this.origin = value;
                break;
            case 'hasDiffToPrev':
                this.hasDiffToPrev = value;
                break;
            case 'createdAt':
                this.createdAt = new Date(value);
                break;
            case '__v':
                this.version = value;
                break;
            default:
                throw new Error(`Unknown key: ${key}`);
        }
        return this;
    }
}
exports.Revision = Revision;
