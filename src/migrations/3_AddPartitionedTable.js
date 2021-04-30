class AddPartitionedTable extends require('../Migration') {

  async body() {

    console.info(`Migration to add partitioned table coins_data_p`)

    let indexes = await (await this.sql()).schema.raw(`
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = 'coins'
          AND indexname = 'idx_coins_slug';
    `)

    let found = indexes.length === 1

    if (!found) {
      await (await this.sql()).schema.raw(`
          CREATE INDEX IF NOT EXISTS idx_coins_slug ON coins (slug);
      `)
      console.info('Index idx_coins_slug created.')
    } else {
      console.info('Index idx_coins_slug previously created.')
    }


    found = await (await this.sql()).schema.hasColumn('coins_data', 'slug')

    if (!found) {
      await (await this.sql()).schema.alterTable('coins_data', table => {
        table.string('slug').index()
        table.timestamp('ds').index()
        table.renameColumn('quote_USD_price', 'quote_usd_price')
        table.renameColumn('quote_USD_volume_24h', 'quote_usd_volume_24h')
        table.renameColumn('quote_USD_percent_change_1h', 'quote_usd_percent_change_1h')
        table.renameColumn('quote_USD_percent_change_24h', 'quote_usd_percent_change_24h')
        table.renameColumn('quote_USD_percent_change_7d', 'quote_usd_percent_change_7d')
        table.renameColumn('quote_USD_percent_change_30d', 'quote_usd_percent_change_30d')
        table.renameColumn('quote_USD_percent_change_60d', 'quote_usd_percent_change_60d')
        table.renameColumn('quote_USD_percent_change_90d', 'quote_usd_percent_change_90d')
        table.renameColumn('quote_USD_market_cap', 'quote_usd_market_cap')
        table.renameColumn('quote_USD_last_updated', 'quote_usd_last_updated')
      })
      console.info('Colum slug added to coins_data.')
    } else {
      console.info('Colum slug previously added to coins_data.')
    }

    // found = await (await this.sql()).schema.hasTable('coins_data_p')
    //
    // if (!found) {
    //   await (await this.sql()).schema.raw(`
    //       CREATE TABLE coins_data_p
    //       (
    //           id                           INTEGER   NOT NULL,
    //           slug                         TEXT      NOT NULL,
    //           ds                           TIMESTAMP NOT NULL,
    //           cmc_rank                     INTEGER   NOT NULL,
    //           max_supply                   NUMERIC(30, 10),
    //           circulating_supply           NUMERIC(30, 10),
    //           total_supply                 NUMERIC(30, 10),
    //           last_updated                 TIMESTAMP NOT NULL,
    //           quote_USD_price              NUMERIC(30, 10),
    //           quote_USD_volume_24h         NUMERIC(30, 10),
    //           quote_USD_percent_change_1h  NUMERIC(30, 10),
    //           quote_USD_percent_change_24h NUMERIC(30, 10),
    //           quote_USD_percent_change_7d  NUMERIC(30, 10),
    //           quote_USD_percent_change_30d NUMERIC(30, 10),
    //           quote_USD_percent_change_60d NUMERIC(30, 10),
    //           quote_USD_percent_change_90d NUMERIC(30, 10),
    //           quote_USD_market_cap         NUMERIC(30, 10),
    //           quote_USD_last_updated       TIMESTAMP NOT NULL
    //       ) PARTITION BY RANGE (ds);
    //       CREATE INDEX idx_coins_data_p_id ON coins_data_p (id);
    //       CREATE INDEX idx_coins_data_p_slug ON coins_data_p (slug);
    //   `);
    //   console.info('Table coins_data2 created.')
    // } else {
    //   console.info('Table coins_data2 previously created.')
    // }
  }
}

module.exports = AddPartitionedTable
