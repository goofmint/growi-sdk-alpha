/// <reference types="node" />
import { GROWI, Page, User } from ".";
import { AttachmentParams, ListAttachmentsResult } from "./types/attachment";
declare class Attachment {
    static client: GROWI;
    id?: string;
    __v?: number;
    fileFormat?: string;
    fileName?: string;
    originalName?: string;
    creator?: User;
    page?: Page;
    createdAt?: Date;
    fileSize?: number;
    url?: string;
    filePathProxied?: string;
    downloadPathProxied?: string;
    attachmentType?: string;
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data?: AttachmentParams);
    /**
     * Set attachment's properties
     * @param data
     */
    sets(data: AttachmentParams): Attachment;
    /**
     * Set attachment's property
     * @param key
     * @param value
     * @returns Page
     */
    set(key: string, value: any): Attachment;
    static upload(page: Page, file: Buffer, fileName: string): Promise<Attachment>;
    static find(id: string): Promise<Attachment>;
    static list(page: Page, pageNumber?: number, limit?: number): Promise<ListAttachmentsResult>;
    static limit(fileSize: number): Promise<boolean>;
}
export { Attachment };
