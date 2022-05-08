import { BaseEntity, Entity, PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';


@Entity()
export class CasbinMongoRule extends BaseEntity<CasbinMongoRule, 'id'> {
  // mongodb 专用
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({
    nullable: true
  })
  public ptype!: string;

  @Property({
    nullable: true
  })
  public v0!: string;

  @Property({
    nullable: true
  })
  public v1!: string;

  @Property({
    nullable: true
  })
  public v2!: string;

  @Property({
    nullable: true
  })
  public v3!: string;

  @Property({
    nullable: true
  })
  public v4!: string;

  @Property({
    nullable: true
  })
  public v5!: string;

  @Property({
    nullable: true
  })
  public v6!: string;

  @Property()
  public createdAt?: Date | string;
  @Property()
  public updatedAt?: Date | string;

  constructor() {
    super()
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

}
