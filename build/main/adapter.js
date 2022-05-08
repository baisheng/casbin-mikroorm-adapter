"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const casbin_1 = require("casbin");
const casbinRule_1 = require("./casbinRule");
// import {
//   Connection,
//   ConnectionOptions,
//   createConnection,
//   getRepository,
// } from 'typeorm';
const casbinMongoRule_1 = require("./casbinMongoRule");
const core_1 = require("@mikro-orm/core");
// interface ExistentConnection {
//   connection: Connection;
// }
// export type MikroORMAdapterOptions = ExistentConnection | ConnectionOptions;
/**
 * MikroORMAdapter represents the TypeORM filtered adapter for policy storage.
 */
class MikroORMAdapter {
    constructor(option) {
        this.filtered = false;
        this.option = option;
        // this.mikroOrm = new MikroORM<IDatabaseDriver>(option)
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
    isFiltered() {
        return this.filtered;
    }
    /**
     * newAdapter is the constructor.
     * @param option typeorm connection option
     */
    static async newAdapter(option) {
        let a;
        const defaults = {
            synchronize: true,
            name: 'node-casbin-official',
        };
        const options = option;
        const entities = { entities: [this.getCasbinRuleType('mongodb')] };
        const configuration = Object.assign(defaults, options);
        a = new MikroORMAdapter(Object.assign(configuration, entities));
        await a.open();
        return a;
    }
    async open() {
        if (!this.mikroOrm) {
            this.mikroOrm = await core_1.MikroORM.init({
                type: this.option.type,
                entities: this.option.entities,
                dbName: this.option.dbName,
                debug: this.option.debug,
                highlighter: this.option.highlighter,
            });
            // this.typeorm = await createConnection(this.option);
        }
        const isConnected = await this.mikroOrm.isConnected();
        // if (!await this.mikroOrm.isConnected())
        if (!isConnected) {
            await this.mikroOrm.connect();
        }
        this.em = this.mikroOrm.em;
    }
    async close() {
        const isConnected = await this.mikroOrm.isConnected();
        if (isConnected) {
            await this.mikroOrm.close(true);
        }
    }
    async clearTable() {
        await this.em.nativeDelete(this.getCasbinRuleConstructor(), {});
        // await this.mikroOrm.em.getRepository(this.getCasbinRuleConstructor()).clear();
    }
    loadPolicyLine(line, model) {
        const result = line.ptype +
            ', ' +
            [line.v0, line.v1, line.v2, line.v3, line.v4, line.v5, line.v6]
                .filter((n) => n)
                .map((n) => `"${n}"`)
                .join(', ');
        casbin_1.Helper.loadPolicyLine(result, model);
    }
    /**
     * loadPolicy loads all policy rules from the storage.
     */
    async loadPolicy(model) {
        // const lines = await getRepository(
        //   this.getCasbinRuleConstructor(),
        //   this.option.name,
        // ).find();
        // const lines = await this.mikroOrm.em.getRepository(this.getCasbinRuleConstructor())
        const lines = await this.em.find(this.getCasbinRuleConstructor(), {});
        for (const line of lines) {
            this.loadPolicyLine(line, model);
        }
    }
    // Loading policies based on filter condition
    async loadFilteredPolicy(model, filter) {
        // const filteredLines = await getRepository(
        // this.getCasbinRuleConstructor(),
        // this.option.name,
        // ).find(filter);
        const filteredLines = await this.em.find(this.getCasbinRuleConstructor(), Object.assign({}, filter));
        for (const line of filteredLines) {
            this.loadPolicyLine(line, model);
        }
        this.filtered = true;
    }
    savePolicyLine(ptype, rule) {
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
    async savePolicy(model) {
        await this.clearTable();
        let astMap = model.model.get('p');
        const lines = [];
        // @ts-ignore
        for (const [ptype, ast] of astMap) {
            for (const rule of ast.policy) {
                const line = this.savePolicyLine(ptype, rule);
                lines.push(line);
            }
        }
        astMap = model.model.get('g');
        // @ts-ignore
        for (const [ptype, ast] of astMap) {
            for (const rule of ast.policy) {
                const line = this.savePolicyLine(ptype, rule);
                lines.push(line);
            }
        }
        if (Array.isArray(lines) && lines.length > 0) {
            await this.em.getDriver().nativeInsertMany(this.getCasbinRuleConstructor().name, lines);
        }
        return true;
    }
    /**
     * addPolicy adds a policy rule to the storage.
     */
    async addPolicy(sec, ptype, rule) {
        const line = this.savePolicyLine(ptype, rule);
        await this.em.persistAndFlush(line);
        // await getRepository(this.getCasbinRuleConstructor(), this.option.name).save(
        //   line,
        // );
    }
    /**
     * addPolicies adds policy rules to the storage.
     */
    async addPolicies(sec, ptype, rules) {
        const lines = [];
        for (const rule of rules) {
            const line = this.savePolicyLine(ptype, rule);
            lines.push(line);
        }
        await this.em.getDriver().nativeInsertMany(this.getCasbinRuleConstructor().name, lines);
    }
    /**
     * removePolicy removes a policy rule from the storage.
     */
    async removePolicy(sec, ptype, rule) {
        const line = this.savePolicyLine(ptype, rule);
        // await getRepository(
        //   this.getCasbinRuleConstructor(),
        //   this.option.name,
        // ).delete(line);
        await this.em.remove(line);
    }
    /**
     * removePolicies removes policy rules from the storage.
     */
    async removePolicies(sec, ptype, rules) {
        for (const rule of rules) {
            const line = this.savePolicyLine(ptype, rule);
            await this.em.remove(line);
        }
        await this.em.clear();
    }
    /**
     * removeFilteredPolicy removes policy rules that match the filter from the storage.
     */
    async removeFilteredPolicy(sec, ptype, fieldIndex, ...fieldValues) {
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
        await this.em.getDriver().nativeDelete(this.getCasbinRuleConstructor().name, line);
    }
    getCasbinRuleConstructor() {
        return MikroORMAdapter.getCasbinRuleType('mongodb');
    }
    /**
     * Returns either a {@link CasbinRule} or a {@link CasbinMongoRule}, depending on the type. This switch is required as the normal
     * {@link CasbinRule} does not work when using MongoDB as a backend (due to a missing ObjectID field).
     * @param type
     */
    static getCasbinRuleType(type) {
        if (type === 'mongodb') {
            return casbinMongoRule_1.CasbinMongoRule;
        }
        return casbinRule_1.CasbinRule;
    }
}
exports.default = MikroORMAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQXNFO0FBQ3RFLDZDQUEwQztBQUMxQyxXQUFXO0FBQ1gsZ0JBQWdCO0FBQ2hCLHVCQUF1QjtBQUN2QixzQkFBc0I7QUFDdEIsbUJBQW1CO0FBQ25CLG9CQUFvQjtBQUNwQix1REFBb0Q7QUFDcEQsMENBSXlCO0FBTXpCLGlDQUFpQztBQUNqQyw0QkFBNEI7QUFDNUIsSUFBSTtBQUNKLCtFQUErRTtBQUUvRTs7R0FFRztBQUNILE1BQXFCLGVBQWU7SUFPbEMsWUFBb0IsTUFBZTtRQUYzQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBR3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLHdEQUF3RDtRQUN4RCxxQ0FBcUM7UUFDckMsdUNBQXVDO1FBQ3ZDLElBQUk7UUFDSixtREFBbUQ7UUFDbkQsb0JBQW9CO1FBQ3BCLDZEQUE2RDtRQUM3RCxxREFBcUQ7UUFDckQsV0FBVztRQUNYLCtDQUErQztRQUMvQyxJQUFJO0lBQ04sQ0FBQztJQUVNLFVBQVU7UUFDZixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQWU7UUFDNUMsSUFBSSxDQUFrQixDQUFDO1FBRXZCLE1BQU0sUUFBUSxHQUFHO1lBQ2YsV0FBVyxFQUFFLElBQUk7WUFDakIsSUFBSSxFQUFFLHNCQUFzQjtTQUM3QixDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsTUFBaUIsQ0FBQztRQUNsQyxNQUFNLFFBQVEsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBRSxFQUFFLENBQUM7UUFDckUsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFR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