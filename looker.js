const migrate = require('./src/migrations')
const Looker = require('./src/Looker')
const looker = new Looker()

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis))
}

async function start() {
  await migrate()
  looker.startHttp()
  await looker.getMarketCapData()
}

start()
