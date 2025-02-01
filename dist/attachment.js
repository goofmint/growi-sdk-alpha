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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const _1 = require(".");
const form_data_1 = __importDefault(require("form-data"));
class Attachment {
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
     * Set attachment's properties
     * @param data
     */
    sets(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
        return this;
    }
    /**
     * Set attachment's property
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
            case '__v':
                this.__v = value;
                break;
            case 'fileFormat':
                this.fileFormat = value;
                break;
            case 'fileName':
                this.fileName = value;
                break;
            case 'originalName':
                this.originalName = value;
                break;
            case 'creator':
                if (value instanceof _1.User) {
                    this.creator = value;
                }
                else if (typeof value == 'object') {
                    this.creator = new _1.User(value);
                }
                else if (typeof value == 'string') {
                    this.creator = new _1.User({ _id: value });
                }
                break;
            case 'page':
                if (value instanceof _1.Page) {
                    this.page = value;
                }
                else if (typeof value == 'object') {
                    this.page = new _1.Page(value);
                }
                else if (typeof value == 'string') {
                    this.page = new _1.Page({ _id: value });
                }
                break;
            case 'createdAt':
                this.createdAt = new Date(value);
                break;
            case 'fileSize':
                this.fileSize = value;
                break;
            case 'url':
                this.url = value;
                break;
            case 'filePathProxied':
                this.filePathProxied = value;
                break;
            case 'downloadPathProxied':
                this.downloadPathProxied = value;
                break;
            case 'attachmentType':
                this.attachmentType = value;
                break;
            default:
                throw new Error(`Unknown key in Attachment: ${key}, ${value}`);
        }
        return this;
    }
    static upload(page, file, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            formData.append('file', file, fileName);
            formData.append('page_id', page.id);
            const res = yield this.client.request('POST', '/_api/v3/attachment', {}, formData);
            const attachment = new Attachment(res.attachment);
            if (res.page)
                attachment.page = new _1.Page(res.page);
            return attachment;
        });
    }
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield Attachment.client.request('GET', `/_api/v3/attachment/${id}`, {});
            return new Attachment(res.attachment);
        });
    }
    static list(page_1) {
        return __awaiter(this, arguments, void 0, function* (page, pageNumber = 1, limit = 10) {
            const params = { pageId: page.id, limit, pageNumber };
            const { paginateResult } = yield this.client.request('GET', '/_api/v3/attachment/list', params);
            const { docs } = paginateResult, result = __rest(paginateResult, ["docs"]);
            result.attachments = docs.map((a) => new Attachment(a));
            return result;
        });
    }
    static limit(fileSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { fileSize };
            const res = yield this.client.request('GET', '/_api/v3/attachment/limit', params);
            return res.isUploadable;
        });
    }
}
exports.Attachment = Attachment;
