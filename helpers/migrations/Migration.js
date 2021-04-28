const Sql = require('../../src/Sql')

class Migration extends Sql {

  constructor(migrationIndex) {
    super()
    this.found = {}
    this.knex = null
    this.migrationIndex = migrationIndex || 0
  }

  async exec() {
    console.log(`Migration #${this.migrationIndex} on ${this.pgData.database}.`)
    await this.body()
  }

  async body() {
  }

}


module.exports = Migration
