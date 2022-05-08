import { Model, FilteredAdapter, BatchAdapter } from 'casbin';
import { Options } from '@mikro-orm/core';
/**
 * MikroORMAdapter represents the TypeORM filtered adapter for policy storage.
 */
export default class MikroORMAdapter implements FilteredAdapter, BatchAdapter {
    private option;
    private mikroOrm;
    private em;
    private filtered;
    private constructor();
    isFiltered(): boolean;
    /**
     * newAdapter is the constructor.
     * @param option typeorm connection option
     */
    static newAdapter(option: Options): Promise<MikroORMAdapter>;
    private open;
    close(): Promise<void>;
    private clearTable;
    private loadPolicyLine;
    /**
     * loadPolicy loads all policy rules from the storage.
     */
    loadPolicy(model: Model): Promise<void>;
    loadFilteredPolicy(model: Model, filter: object): Promise<void>;
    private savePolicyLine;
    /**
     * savePolicy saves all policy rules to the storage.
     */
    savePolicy(model: Model): Promise<boolean>;
    /**
     * addPolicy adds a policy rule to the storage.
     */
    addPolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    /**
     * addPolicies adds policy rules to the storage.
     */
    addPolicies(sec: string, ptype: string, rules: string[][]): Promise<void>;
    /**
     * removePolicy removes a policy rule from the storage.
     */
    removePolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    /**
     * removePolicies removes policy rules from the storage.
     */
    removePolicies(sec: string, ptype: string, rules: string[][]): Promise<void>;
    /**
     * removeFilteredPolicy removes policy rules that match the filter from the storage.
     */
    removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void>;
    private getCasbinRuleConstructor;
    /**
     * Returns either a {@link CasbinRule} or a {@link CasbinMongoRule}, depending on the type. This switch is required as the normal
     * {@link CasbinRule} does not work when using MongoDB as a backend (due to a missing ObjectID field).
     * @param type
     */
    private static getCasbinRuleType;
}
