// tslint:disable:no-expression-statement no-implicit-dependencies
import { newEnforcer, Enforcer, newModel, Util } from 'casbin';
import MikroORMAdapter from '../src/index';

// const m = newModel();
// m.addDef('r', 'r', 'sub, obj, act');
// m.addDef('p', 'p', 'sub, obj, act');
// m.addDef('g', 'g', '_, _');
// m.addDef('e', 'e', 'some(where (p.eft == allow))');
// m.addDef('m', 'm', 'g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act');
async function testGetPolicy(e: Enforcer, res: string[][]) {
  const myRes = await e.getPolicy();

  expect(Util.array2DEquals(res, myRes)).toBe(true);
}
async function testGetFilteredPolicy(e: Enforcer, res: string[]) {
  const filtered = await e.getFilteredNamedPolicy('p', 0, 'alice');
  const myRes = filtered[0];

  expect(Util.arrayEquals(res, myRes)).toBe(true);
}

test(
  'TestAdapter',
  async () => {
    // const mongod = await MongoMemoryServer.create();
    // const uri = mongod.getUri();
    // const mongodbUrl = uri.slice(0, uri.lastIndexOf('/'))
    // console.log(uri)
    const a = await MikroORMAdapter.newAdapter({
      type: 'mongo',
      allowGlobalContext: true,
      clientUrl: 'mongodb://localhost:27017/casbin?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
      // clientUrl: `${mongodbUrl}/casbin`,
      dbName: 'casbin',
    });
    try {

      // Because the DB is empty at first,
      // so we need to load the policy from the file adapter (.CSV) first.
      let e = new Enforcer();

      await e.initWithFile(
        'examples/rbac_model.conf',
        'examples/rbac_policy.csv',
      );

      await a.savePolicy(e.getModel());

      // Clear the current policy
      e.clearPolicy()

      // Load the policy from DB.
      await a.loadPolicy(e.getModel());
      await testGetPolicy(e, [
        ['alice', 'data1', 'read'],
        ['bob', 'data2', 'write'],
        ['data2_admin', 'data2', 'read'],
        ['data2_admin', 'data2', 'write'],
      ]);

      // Note: you don't need to look at the above code
      // if you already have a working DB with policy inside.

      // Now the DB has policy, so we can provide a normal use case.
      // Create an adapter and an enforcer.
      // newEnforcer() will load the policy automatically.
      e = new Enforcer();
      await e.initWithAdapter('examples/rbac_model.conf', a);
      await testGetPolicy(e, [
        ['alice', 'data1', 'read'],
        ['bob', 'data2', 'write'],
        ['data2_admin', 'data2', 'read'],
        ['data2_admin', 'data2', 'write'],
      ]);

      // load filtered policies
      await a.loadFilteredPolicy(e.getModel(), { ptype: 'p', v0: 'alice' });
      await testGetFilteredPolicy(e, ['alice', 'data1', 'read']);

      // Add policy to DB
      await a.addPolicy('', 'p', ['role', 'res', 'action']);
      e = new Enforcer();
      await e.initWithAdapter('examples/rbac_model.conf', a);
      await testGetPolicy(e, [
        ['alice', 'data1', 'read'],
        ['bob', 'data2', 'write'],
        ['data2_admin', 'data2', 'read'],
        ['data2_admin', 'data2', 'write'],
        ['role', 'res', 'action'],
      ]);

      await a.addPolicies('', 'p', [
        ['role1', 'res1', 'action1'],
        ['role2', 'res2', 'action2'],
        ['role3', 'res3', 'action3'],
        ['role4', 'res4', 'action4'],
        ['role5', 'res5', 'action5'],
      ]);
      e = new Enforcer();
      await e.initWithAdapter('examples/rbac_model.conf', a);
      await testGetPolicy(e, [
        ['alice', 'data1', 'read'],
        ['bob', 'data2', 'write'],
        ['data2_admin', 'data2', 'read'],
        ['data2_admin', 'data2', 'write'],
        ['role', 'res', 'action'],
        ['role1', 'res1', 'action1'],
        ['role2', 'res2', 'action2'],
        ['role3', 'res3', 'action3'],
        ['role4', 'res4', 'action4'],
        ['role5', 'res5', 'action5'],
      ]);

      // Remove policy from DB
      await a.removePolicy('', 'p', ['role', 'res', 'action']);
      e = new Enforcer();
      await e.initWithAdapter('examples/rbac_model.conf', a);
      await testGetPolicy(e, [
        ['alice', 'data1', 'read'],
        ['bob', 'data2', 'write'],
        ['data2_admin', 'data2', 'read'],
        ['data2_admin', 'data2', 'write'],
        ['role1', 'res1', 'action1'],
        ['role2', 'res2', 'action2'],
        ['role3', 'res3', 'action3'],
        ['role4', 'res4', 'action4'],
        ['role5', 'res5', 'action5'],
      ]);

      await a.removePolicies('', 'p', [
        ['role1', 'res1', 'action1'],
        ['role2', 'res2', 'action2'],
        ['role3', 'res3', 'action3'],
        ['role4', 'res4', 'action4'],
        ['role5', 'res5', 'action5'],
      ]);
      e = new Enforcer();
      await e.initWithAdapter('examples/rbac_model.conf', a);
      await testGetPolicy(e, [
        ['alice', 'data1', 'read'],
        ['bob', 'data2', 'write'],
        ['data2_admin', 'data2', 'read'],
        ['data2_admin', 'data2', 'write'],
      ]);
      // Add policy to DB
      // await adapter.addPolicy('', 'p', ['role', 'res', 'action']);

    } catch (err: any) {
      throw new Error(err.message);
    } finally {
      await a.close()
    }
  },
  60 * 1000,
);
// test.before('Setting up Casbin and Adapter', async () => {
//   try {
//     const uri = await mongod.getUri();
//     console.log(uri)
//
//     adapter = await MikroORMAdapter.newAdapter({
//       clientUrl: uri,
//       dbName: 'casbin'
//     });
//     e = await newEnforcer(m, adapter);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });
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
