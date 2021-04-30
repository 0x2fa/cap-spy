const superagent = require('superagent')
const _ = require('lodash')
const Sql = require('./Sql')
const fs = require('fs-extra')
const path = require('path')
const JSONdb = require('simple-json-db')
let db

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis))
}

class Looker extends Sql {

  constructor() {
    super();
    fs.ensureDirSync(process.env.JSONDB_DIR)
    db = new JSONdb(path.resolve(process.env.JSONDB_DIR, 'data.json'))
  }


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

  async insertCoinData(data, last_updated) {

    const {
      id,
      slug,
      max_supply,
      total_supply,
      circulating_supply,
      cmc_rank
    } = data

    let values = {
      id,
      slug,
      max_supply,
      total_supply,
      circulating_supply,
      cmc_rank,
      last_updated
    }

    for (let key in data.quote.USD) {
      values[`quote_usd_${key}`] = data.quote.USD[key]
      if (key === 'last_updated') {
        let d = new Date(data.quote.USD.last_updated)
        d.setUTCHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        values.ds = d
      }
    }

    await (await this.sql()).insert(values).into('coins_data')
  }

  async getMarketCapData() {
    const looptime = parseInt(process.env.LOOPTIME) * 1000
    while (true) {
      let lastGrabAt = db.get('lastGrabAt')
      if (!lastGrabAt || Date.now() - lastGrabAt > looptime) {
        try {
          let res = await superagent
              .get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
              .query({
                start: 1,
                limit: process.env.LIMIT,
                convert: 'USD'
              })
              .set('X-CMC_PRO_API_KEY', process.env.COINMARKETCAP_KEY)
              .accept('application/json')

          let last_updated = (new Date).toISOString()
          for (let data of res.body.data) {
            await this.insertCoin(data)
            await this.insertCoinData(data, last_updated)
          }
          db.set('lastGrabAt', Date.now())
          console.log('Data saved at', res.body.status.timestamp)
        } catch (e) {
          console.log(e)
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('Skipping')
        }
      }
      await sleep(Math.round(looptime / 10))
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
