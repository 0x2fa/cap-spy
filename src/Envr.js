const fs = require('fs-extra')
const path = require('path')

class Envr {

  static get(envfile = process.env.ENV_FILE) {
    if (envfile && fs.existsSync(path.resolve(__dirname, '..', envfile))) {
      let content = fs.readFileSync(path.resolve(__dirname, '..', envfile), 'utf-8')
      content = content.replace(/export /g, '').split('\n')
      for (let c of content) {
        let kv = c.split('=')
        if (kv[0]) {
          process.env[kv[0]] = kv[1]
        }
      }
    }
  }

}

module.exports = Envr
