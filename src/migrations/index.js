const _ = require('lodash')
const fs = require('fs-extra')

async function migrate() {

  let migrations = _
      .filter(await fs.readdir(__dirname), e => /^\d+_/.test(e))
      .sort((a, b) => {
        let A = parseInt(a.split('_')[0])
        let B = parseInt(b.split('_')[0])
        return A > B ? 1 : A < B ? -1 : 0
      })

  for (let i = 0; i < migrations.length; i++) {
    try {
      const Klass = require(`./${migrations[i]}`)
      let klass = new Klass(i + 1)
      await klass.exec()
    } catch (e) {
      console.error(`Error migrating ${migrations[i]}`)
      console.error(e.message)
    }
  }
}

module.exports = migrate
