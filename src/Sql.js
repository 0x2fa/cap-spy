const knex = require('knex')

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis))
}

const {
  pgData,
} = require('./config')

class Sql {

  constructor() {
    this.pgData = pgData
  }

  async sql() {
    if (!this.client) {
      while (true) {
        try {
          this.client = knex({
            client: 'pg',
            connection: pgData
          })
          await this.client.raw('select 1+1 as result')
          break
        } catch (err) {
          console.debug('Postgres not ready')
        }
        await sleep(3000)
      }
    }
    return this.client
  }

}


module.exports = Sql
