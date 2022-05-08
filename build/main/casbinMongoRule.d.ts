import { BaseEntity } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
export declare class CasbinMongoRule extends BaseEntity<CasbinMongoRule, 'id'> {
    _id: ObjectId;
    id: string;
    ptype: string;
    v0: string;
    v1: string;
    v2: string;
    v3: string;
    v4: string;
    v5: string;
    v6: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    constructor();
}
