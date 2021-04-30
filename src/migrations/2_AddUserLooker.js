const _ = require('lodash')

class AddUserLooker extends require('../Migration') {

  async body() {

    console.info(`Migration for adding user "looker"`)

    let found = _
        .filter((await (await this.sql()).schema.raw(`
                    SELECT usename AS role_name,
                           CASE
                               WHEN usesuper AND usecreatedb THEN
                                   CAST('superuser, create database' AS pg_catalog.text)
                               WHEN usesuper THEN
                                   CAST('superuser' AS pg_catalog.text)
                               WHEN usecreatedb THEN
                                   CAST('create database' AS pg_catalog.text)
                               ELSE
                                   CAST('' AS pg_catalog.text)
                               END    role_attributes
                    FROM pg_catalog.pg_user
                    ORDER BY role_name desc;
            `)).rows,
            e => e.role_name === 'looker')
        .length

    if (!found) {
      await (await this.sql()).schema.raw(`
CREATE USER looker WITH ENCRYPTED PASSWORD '${process.env.LOOKER_PASSWORD}';
GRANT ALL PRIVILEGES ON DATABASE ${this.pgData.database} TO looker;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO looker;
`)
      console.info('User "looker" added.')
    } else {
      console.info('User "looker" previously added.')
    }

  }
}

module.exports = AddUserLooker
