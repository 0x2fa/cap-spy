const _ = require('lodash')

class CreateInitialTables extends require('../Migration') {

  async body() {

    console.info(`Migration for initial table creation initiated`)

    let found = await (await this.sql()).schema.hasTable('coins')

    if (!found) {
      await (await this.sql()).schema.createTable('coins', table => {
        table.integer('id').primary()
        table.string('name')
        table.string('symbol').index()
        table.string('slug')
        table.integer('num_market_pairs')
        table.timestamp('date_added')
        table.text('tags')
      })
      console.info('Table coins created.')
    } else {
      console.info('Table coins previously created.')
    }

    found = await (await this.sql()).schema.hasTable('coins_data')

    if (!found) {
      await (await this.sql()).schema.createTable('coins_data', table => {
        table.integer('id').index()
        table.integer('cmc_rank')
        table.decimal('max_supply', 30, 10)
        table.decimal('circulating_supply', 30, 10)
        table.decimal('total_supply', 30, 10)
        table.timestamp('last_updated')
        table.decimal('quote_USD_price', 30, 10)
        table.decimal('quote_USD_volume_24h', 30, 10)
        table.decimal('quote_USD_percent_change_1h', 30, 10)
        table.decimal('quote_USD_percent_change_24h', 30, 10)
        table.decimal('quote_USD_percent_change_7d', 30, 10)
        table.decimal('quote_USD_percent_change_30d', 30, 10)
        table.decimal('quote_USD_percent_change_60d', 30, 10)
        table.decimal('quote_USD_percent_change_90d', 30, 10)
        table.decimal('quote_USD_market_cap', 30, 10)
        table.timestamp('quote_USD_last_updated')
      })
      console.info('Table coins_data created.')
    } else {
      console.info('Table coins_data previously created.')
    }

  }
}

module.exports = CreateInitialTables
