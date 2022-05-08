"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-implicit-dependencies
const ava_1 = __importDefault(require("ava"));
const casbin_1 = require("casbin");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const adapter_1 = __importDefault(require("./adapter"));
// Start MongoDB instance
const mongod = new mongodb_memory_server_1.MongoMemoryServer();
let adapter;
let e;
const m = (0, casbin_1.newModel)();
m.addDef('r', 'r', 'sub, obj, act');
m.addDef('p', 'p', 'sub, obj, act');
m.addDef('g', 'g', '_, _');
m.addDef('e', 'e', 'some(where (p.eft == allow))');
m.addDef('m', 'm', 'g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act');
ava_1.default.before('Setting up Casbin and Adapter', async () => {
    try {
        const uri = await mongod.getUri();
        console.log(uri);
        adapter = await adapter_1.default.newAdapter({
            clientUrl: uri,
            dbName: 'casbin'
        });
        e = await (0, casbin_1.newEnforcer)(m, adapter);
    }
    catch (error) {
        throw new Error(error.message);
    }
});
/*
test('Missing Mongo URI', async t => {
  const error = await t.throwsAsync(
    MikroORMAdapter.newAdapter({
      // @ts-ignore
      uri: null,
      collection: 'casbin',
      database: 'casbindb'
    })
  );
  t.is(error.message, 'you must provide mongo URI to connect to!');
});

test('Wrong Mongo Connection String', async t => {
  const error = await t.throwsAsync(
    MikroORMAdapter.newAdapter({
      uri: 'wrong',
      collection: 'casbin',
      database: 'casbindb'
    })
  );
  t.is(error.message, 'Invalid connection string');
});

test('Open adapter connection', async t => {
  await t.notThrowsAsync(adapter.open());
});

test('Creates DB indexes', async t => {
  await t.notThrowsAsync(adapter.createDBIndex());
});

test('Add policy', t => {
  t.truthy(e.addPolicy('alice', 'data3', 'read'));
});

test('Save the policy back to DB', async t => {
  t.true(await e.savePolicy());
});

test('Load policy', async t => {
  t.deepEqual(await e.loadPolicy(), undefined);
});

test('Check alice permission', async t => {
  t.falsy(await e.enforce('alice', 'data1', 'read'));
});

test('Save policy against adapter', async t => {
  t.true(await adapter.savePolicy(m));
});

test('Add policy against adapter', async t => {
  await t.notThrowsAsync(adapter.addPolicy('alice', 'data5', ['read']));
});

test('Add policies successfully', async t => {
  await t.notThrowsAsync(
    adapter.addPolicies('', 'john', [['create'], ['write']])
  );
});

test('Removes policies successfully', async t => {
  await t.notThrowsAsync(
    adapter.removePolicies('', 'john', [['create'], ['write']])
  );
});

test('Remove filtered policy against adapter', async t => {
  await t.notThrowsAsync(
    adapter.removeFilteredPolicy('alice', 'data5', 0, 'read')
  );
});

test('Remove policy against adapter', async t => {
  await t.notThrowsAsync(adapter.removePolicy('alice', 'data5', ['read']));
});

test.after('Close connection', async t => {
  t.notThrows(async () => adapter.close());
});
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQWtFO0FBQ2xFLDhDQUF1QjtBQUN2QixtQ0FBeUQ7QUFDekQsaUVBQTBEO0FBQzFELHdEQUF3QztBQUV4Qyx5QkFBeUI7QUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSx5Q0FBaUIsRUFBRSxDQUFBO0FBRXRDLElBQUksT0FBd0IsQ0FBQTtBQUM1QixJQUFJLENBQVcsQ0FBQTtBQUdmLE1BQU0sQ0FBQyxHQUFHLElBQUEsaUJBQVEsR0FBRSxDQUFDO0FBQ3JCLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUNwQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBQ25ELENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxxREFBcUQsQ0FBQyxDQUFDO0FBRTFFLGFBQUksQ0FBQyxNQUFNLENBQUMsK0JBQStCLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDdEQsSUFBSTtRQUNGLE1BQU0sR0FBRyxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFaEIsT0FBTyxHQUFHLE1BQU0saUJBQWUsQ0FBQyxVQUFVLENBQUM7WUFDekMsU0FBUyxFQUFFLEdBQUc7WUFDZCxNQUFNLEVBQUUsUUFBUTtTQUNqQixDQUFDLENBQUM7UUFDSCxDQUFDLEdBQUcsTUFBTSxJQUFBLG9CQUFXLEVBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ25DO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNoQztBQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWlGRSJ9