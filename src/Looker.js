const superagent = require('superagent')
const _ = require('lodash')
const Sql = require('./Sql')

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis))
}

class Looker extends Sql {

  async insertCoin(data) {

    let exists = await (await this.sql()).select('symbol').from('coins').where({
      id: data.id
    })

    if (exists.length === 0) {

      const {
        id,
        name,
        symbol,
        slug,
        num_market_pairs,
        date_added,
        tags
      } = data

      await (await this.sql()).insert({
        id,
        name,
        symbol,
        slug,
        num_market_pairs,
        date_added,
        tags: tags.join(',')
      }).into('coins')
    }
  }

  async getMarketCapData() {

    while (true) {
      try {
        let res = await superagent
            .get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
            .query({
              start: 1,
              limit: 2500,
              convert: 'USD'
            })
            .set('X-CMC_PRO_API_KEY', process.env.COINMARKETCAP_KEY)
            .accept('application/json')

        for (let data of res.body.data) {

          await this.insertCoin(data)

          const {
            id,
            max_supply,
            total_supply,
            circulating_supply,
            cmc_rank,
            last_updated
          } = data

          let values = {
            id,
            max_supply,
            total_supply,
            circulating_supply,
            cmc_rank,
            last_updated
          }

          for (let key in data.quote.USD) {
            values[`quote_USD_${key}`] = data.quote.USD[key]
          }

          await (await this.sql()).insert(values).into('coins_data')
        }
        console.log('Data saved at', res.body.status.timestamp)
      } catch (e) {
      }
      await sleep(2 * 1000 * 3600)
    }
  }

  startHttp() {

    const pkg = require('../package.json')
    const http = require('http')
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.write(`Looker ${pkg.version}`)
      res.end()
    }).listen(9669)
    console.log('Server started')
  }

}

module.exports = Looker
