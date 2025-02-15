import { Page } from "./page";
import { RevisionParams } from "./types/revision";
import { User } from "./user";
declare class Revision {
    id?: string;
    format?: string;
    page?: Page;
    body?: string;
    author?: User;
    origin?: string;
    hasDiffToPrev?: boolean;
    createdAt?: Date;
    version?: number;
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data?: RevisionParams);
    /**
     * Set revision's properties
     * @param data RevisionParams
     * @returns Revision
     */
    sets(data: RevisionParams): Revision;
    /**
     * Set revision's property
     * @param key string
     * @param value any
     * @returns Revision
     */
    set(key: string, value: any): Revision;
}
export { Revision };
