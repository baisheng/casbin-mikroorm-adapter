import { Helper, Model, FilteredAdapter, BatchAdapter } from 'casbin';
import { CasbinRule } from './casbinRule';
// import {
//   Connection,
//   ConnectionOptions,
//   createConnection,
//   getRepository,
// } from 'typeorm';
import { CasbinMongoRule } from './casbinMongoRule';
import {
  Options,
  MikroORM,
} from '@mikro-orm/core';
import { MongoDriver,   EntityManager, } from '@mikro-orm/mongodb';
type GenericCasbinRule = CasbinRule | CasbinMongoRule;
type CasbinRuleConstructor = new (...args: any[]) => GenericCasbinRule;

// interface ExistentConnection {
//   connection: Connection;
// }
// export type MikroORMAdapterOptions = ExistentConnection | ConnectionOptions;

/**
 * MikroORMAdapter represents the TypeORM filtered adapter for policy storage.
 */
export default class MikroORMAdapter implements FilteredAdapter, BatchAdapter {
  private option: Options;
  // private typeorm: Connection;
  private mikroOrm: MikroORM<MongoDriver>;
  // private em: EntityManager;
  private filtered = false;

  private constructor(option: Options) {
    this.option = option;
    // this.mikroOrm = new MikroORM<MongoDriver>(option)
    // if (this.mikroOrm.isConnected()) {
    //   this.option = this.mikroOrm.config
    // }
    // if ((option as ExistentConnection).connection) {
    //   this.mikroOrm =
    // this.mikroOrm = (option as ExistentConnection).connection;
    // this.option = this.mikroOrm.getConnectionOptions()
    // } else {
    //   this.option = option as ConnectionOptions;
    // }
  }

  public isFiltered(): boolean {
    return this.filtered;
  }

  /**
   * newAdapter is the constructor.
   * @param option typeorm connection option
   */
  public static async newAdapter(option: Options) {
    let a: MikroORMAdapter;

    const defaults = {
      synchronize: true,
      name: 'node-casbin-official',
    };
    const options = option as Options;
    const entities = { entities: [ this.getCasbinRuleType('mongodb') ] };
    const configuration = Object.assign(defaults, options);
    a = new MikroORMAdapter(Object.assign(configuration, entities));
    await a.open();
    return a;
  }

  private async open() {
    if (!this.mikroOrm) {
      this.mikroOrm = await MikroORM.init<MongoDriver>({
        type: this.option.type,
        entities: this.option.entities,
        dbName: this.option.dbName,
        debug: this.option.debug,
        highlighter: this.option.highlighter,
        // allowGlobalContext: this.option.allowGlobalContext,
      });
      // this.typeorm = await createConnection(this.option);
    }
    const isConnected = await this.mikroOrm.isConnected();
    // if (!await this.mikroOrm.isConnected())
    if (!isConnected) {
      await this.mikroOrm.connect();
    }
    // this.em = this.mikroOrm.em
  }

  public async close() {
    const isConnected = await this.mikroOrm.isConnected();
    if (isConnected) {
      await this.mikroOrm.close(true);
    }
  }

  private async clearTable() {
    const em = this.mikroOrm.em.fork();
    await em.nativeDelete(this.getCasbinRuleConstructor(), {})
    // await this.mikroOrm.em.getRepository(this.getCasbinRuleConstructor()).clear();
  }

  private loadPolicyLine(line: GenericCasbinRule, model: Model) {
    const result =
      line.ptype +
      ', ' +
      [ line.v0, line.v1, line.v2, line.v3, line.v4, line.v5, line.v6 ]
        .filter((n) => n)
        .map((n) => `"${n}"`)
        .join(', ');
    Helper.loadPolicyLine(result, model);
  }

  /**
   * loadPolicy loads all policy rules from the storage.
   */
  public async loadPolicy(model: Model) {
    // const lines = await getRepository(
    //   this.getCasbinRuleConstructor(),
    //   this.option.name,
    // ).find();
    // const lines = await this.mikroOrm.em.getRepository(this.getCasbinRuleConstructor())
    const em = this.mikroOrm.em.fork();
    const lines = await em.find(this.getCasbinRuleConstructor(), {});
    for (const line of lines) {
      this.loadPolicyLine(line, model);
    }
  }

  // Loading policies based on filter condition
  public async loadFilteredPolicy(model: Model, filter?: object) {
    // const filteredLines = await getRepository(
    // this.getCasbinRuleConstructor(),
    // this.option.name,
    // ).find(filter);
    const em = this.mikroOrm.em.fork();

    const filteredLines = await em.find(this.getCasbinRuleConstructor(), { ...filter })
    for (const line of filteredLines) {
      this.loadPolicyLine(line, model);
    }
    this.filtered = true;
  }

  private savePolicyLine(ptype: string, rule: string[]): GenericCasbinRule {
    const line = new (this.getCasbinRuleConstructor())();

    line.ptype = ptype;
    if (rule.length > 0) {
      line.v0 = rule[0];
    }
    if (rule.length > 1) {
      line.v1 = rule[1];
    }
    if (rule.length > 2) {
      line.v2 = rule[2];
    }
    if (rule.length > 3) {
      line.v3 = rule[3];
    }
    if (rule.length > 4) {
      line.v4 = rule[4];
    }
    if (rule.length > 5) {
      line.v5 = rule[5];
    }
    if (rule.length > 6) {
      line.v6 = rule[6];
    }

    return line;
  }

  /**
   * savePolicy saves all policy rules to the storage.
   */
  public async savePolicy(model: Model) {
    await this.clearTable();

    let astMap = model.model.get('p');
    const lines: GenericCasbinRule[] = [];
    // @ts-ignore
    for (const [ ptype, ast ] of astMap) {
      for (const rule of ast.policy) {
        const line = this.savePolicyLine(ptype, rule);
        lines.push(line);
      }
    }

    astMap = model.model.get('g');
    // @ts-ignore
    for (const [ ptype, ast ] of astMap) {
      for (const rule of ast.policy) {
        const line = this.savePolicyLine(ptype, rule);
        lines.push(line);
      }
    }

    const em = this.mikroOrm.em.fork();

    if (Array.isArray(lines) && lines.length > 0) {
      await em.getDriver().nativeInsertMany(this.getCasbinRuleConstructor().name, lines);
    }

    return true;
  }

  /**
   * addPolicy adds a policy rule to the storage.
   */
  public async addPolicy(sec: string, ptype: string, rule: string[]) {
    const line = this.savePolicyLine(ptype, rule);
    const em = this.mikroOrm.em.fork();

    await em.persistAndFlush(line)
    // await getRepository(this.getCasbinRuleConstructor(), this.option.name).save(
    //   line,
    // );
  }

  /**
   * addPolicies adds policy rules to the storage.
   */
  public async addPolicies(sec: string, ptype: string, rules: string[][]) {
    const lines: GenericCasbinRule[] = [];
    for (const rule of rules) {
      const line = this.savePolicyLine(ptype, rule);
      lines.push(line);
    }
    const em = this.mikroOrm.em.fork();

    await em.getDriver().nativeInsertMany(this.getCasbinRuleConstructor().name, lines);
  }

  /**
   * removePolicy removes a policy rule from the storage.
   */
  public async removePolicy(sec: string, ptype: string, rule: string[]) {
    const line = this.savePolicyLine(ptype, rule);
    // await getRepository(
    //   this.getCasbinRuleConstructor(),
    //   this.option.name,
    // ).delete(line);
    const em = this.mikroOrm.em.fork();

    await em.remove(line)
  }

  /**
   * removePolicies removes policy rules from the storage.
   */
  public async removePolicies(sec: string, ptype: string, rules: string[][]) {
    const em = this.mikroOrm.em.fork();

    for (const rule of rules) {
      const line = this.savePolicyLine(ptype, rule)
      await em.remove(line);
    }
    await em.clear();
  }

  /**
   * removeFilteredPolicy removes policy rules that match the filter from the storage.
   */
  public async removeFilteredPolicy(
    sec: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ) {
    const line = new (this.getCasbinRuleConstructor())();

    line.ptype = ptype;

    if (fieldIndex <= 0 && 0 < fieldIndex + fieldValues.length) {
      line.v0 = fieldValues[0 - fieldIndex];
    }
    if (fieldIndex <= 1 && 1 < fieldIndex + fieldValues.length) {
      line.v1 = fieldValues[1 - fieldIndex];
    }
    if (fieldIndex <= 2 && 2 < fieldIndex + fieldValues.length) {
      line.v2 = fieldValues[2 - fieldIndex];
    }
    if (fieldIndex <= 3 && 3 < fieldIndex + fieldValues.length) {
      line.v3 = fieldValues[3 - fieldIndex];
    }
    if (fieldIndex <= 4 && 4 < fieldIndex + fieldValues.length) {
      line.v4 = fieldValues[4 - fieldIndex];
    }
    if (fieldIndex <= 5 && 5 < fieldIndex + fieldValues.length) {
      line.v5 = fieldValues[5 - fieldIndex];
    }
    if (fieldIndex <= 6 && 6 < fieldIndex + fieldValues.length) {
      line.v6 = fieldValues[6 - fieldIndex];
    }
    // await getRepository(
    //   this.getCasbinRuleConstructor(),
    //   this.option.name,
    // ).delete(line);
    // await this.em.remove(line)
    await this.mikroOrm.em.getDriver().nativeDelete(this.getCasbinRuleConstructor().name, line)
  }

  private getCasbinRuleConstructor(): CasbinRuleConstructor {
    return MikroORMAdapter.getCasbinRuleType('mongodb');
  }

  /**
   * Returns either a {@link CasbinRule} or a {@link CasbinMongoRule}, depending on the type. This switch is required as the normal
   * {@link CasbinRule} does not work when using MongoDB as a backend (due to a missing ObjectID field).
   * @param type
   */
  private static getCasbinRuleType(type: string): CasbinRuleConstructor {
    if (type === 'mongodb') {
      return CasbinMongoRule;
    }
    return CasbinRule;
  }
}
