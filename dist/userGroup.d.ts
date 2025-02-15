import { GROWI } from ".";
import { DeleteUserGroupParams, GroupsParams, UpdateUserGroupParams, UserGroupParams, UserGroupRootResponse } from "./types/userGroup";
declare class UserGroup {
    static client: GROWI;
    id?: string;
    name?: string;
    parent?: UserGroup;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    version?: number;
    _ancestors: UserGroup[];
    _children: UserGroup[];
    grandChildren: UserGroup[];
    /**
     * Constructor
     * @param data
     * @returns
     */
    constructor(data?: UserGroupParams);
    static root(params: GroupsParams): Promise<UserGroupRootResponse>;
    children(includeGrandChildren?: boolean): Promise<UserGroup[]>;
    ancestors(): Promise<UserGroup[]>;
    save(params?: UpdateUserGroupParams): Promise<boolean>;
    create(): Promise<boolean>;
    update({ forceUpdateParents }?: UpdateUserGroupParams): Promise<boolean>;
    get(): Promise<boolean>;
    delete(params?: DeleteUserGroupParams): Promise<boolean>;
    /**
     * Set userGroup's properties
     * @param data UserGroupParams
     * @returns UserGroup
     */
    sets(data: UserGroupParams): UserGroup;
    /**
     * Set user's property
     * @param key string
     * @param value any
     * @returns UserGroup
     */
    set(key: string, value: any): UserGroup;
}
export { UserGroup };
