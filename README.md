Casbin MikroORM Adapter
====
Casbin MikroORM Adapter is the [MikroORM](https://mikro-orm.io/) adapter for [Node-Casbin](https://github.
com/casbin/node-casbin). With this library, Node-Casbin can load policy from MikroORM supported database or save policy to it.

Based on [Officially Supported Databases](https://mikro-orm.io), the current supported databases are:

- [x] MongoDB
- [ ] MySQL
- [ ] PostgreSQL
- [ ] MariaDB
- [ ] SQLite
- [ ] MS SQL Server
- [ ] Oracle
- [ ] WebSQL


You may find other 3rd-party supported DBs in MikroORM website or other places.

## Installation

    npm install casbin-mikroorm-adapter

## Simple Example

```typescript
import { newEnforcer } from 'casbin';
import MikroOrmAdapter from 'casbin-mikroorm-adapter';

async function myFunction() {
    // Initialize a MikroORM adapter and use it in a Node-Casbin enforcer:
    // The adapter can not automatically create database.
    // But the adapter will automatically and use the table named "casbin_rule".
    // I think ORM should not automatically create databases.  
    const a = await MikroOrmAdapter.newAdapter({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'casbin',
    });


    const e = await newEnforcer('examples/rbac_model.conf', a);

    // Load the policy from DB.
    await e.loadPolicy();

    // Check the permission.
    await e.enforce('alice', 'data1', 'read');

    // Modify the policy.
    // await e.addPolicy(...);
    // await e.removePolicy(...);

    // Save the policy back to DB.
    await e.savePolicy();
}
```

## Simple Filter Example

```typescript
import { newEnforcer } from 'casbin';
import MikroOrmAdapter from 'MikroOrm-adapter';

async function myFunction() {
    // Initialize a MikroORM adapter and use it in a Node-Casbin enforcer:
    // The adapter can not automatically create database.
    // But the adapter will automatically and use the table named "casbin_rule".
    // I think ORM should not automatically create databases.  
    const a = await MikroOrmAdapter.newAdapter({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'casbin',
    });


    const e = await newEnforcer('examples/rbac_model.conf', a);

    // Load the filtered policy from DB.
    await e.loadFilteredPolicy({
        'ptype': 'p',
        'v0': 'alice'
    });

    // Check the permission.
    await e.enforce('alice', 'data1', 'read');

    // Modify the policy.
    // await e.addPolicy(...);
    // await e.removePolicy(...);

    // Save the policy back to DB.
    await e.savePolicy();
}
```
## Getting Help

- [Node-Casbin](https://github.com/casbin/node-casbin)

