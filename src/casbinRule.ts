import { BaseEntity, Entity, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

// import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class CasbinRule extends BaseEntity<CasbinRule, 'id'> {
  @SerializedPrimaryKey()
  id!: string;

  @Property()
  public ptype: string;

  @Property()
  public v0: string;

  @Property()
  public v1: string;

  @Property()
  public v2: string;

  @Property()
  public v3: string;

  @Property()
  public v4: string;

  @Property()
  public v5: string;

  @Property()
  public v6: string;
}
