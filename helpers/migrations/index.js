const migrations = [
  'CreateInitialTables'
]

const sleep = async (millis) => {
  return new Promise(resolve => setTimeout(resolve, millis))
}

async function migrate() {
  // give time to Postgres to setup
  // await sleep(3000)
  try {
    for (let i = 0; i < migrations.length; i++) {
      const Klass = require(`./${migrations[i]}`)
      let klass = new Klass(i + 1)
      await klass.exec()
    }
  } catch(e) {
    console.log(e)
  }
}

module.exports = migrate
