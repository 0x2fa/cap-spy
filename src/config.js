const _ = require('lodash')

const Envr = require('./Envr')
Envr.get()

const isLocal = process.platform === 'darwin'
const env = process.env

let pgConf
let pgConfMaster

if (isLocal) {

  pgConf = pgConfMaster = {
    host: '127.0.0.1',
    port: 5433
  }

} else {
  pgConf = pgConfMaster = {
    host: 'postgres.spy',
    port: 5432
  }

}

const isProduction = env.NODE_ENV === 'production'

const pgData = {
  host: pgConfMaster.host,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT || 5432
}

module.exports = {
  isLocal,
  pgConf,
  pgConfMaster,
  pgData,
  nodeEnv: env.NODE_ENV || 'development',
  isProduction
}
