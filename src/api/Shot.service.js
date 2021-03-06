import webshot from 'webshot'
import imgur from 'imgur'

import config from 'config'

imgur.setClientId(config.imgurClient)
imgur.setCredentials('imgur@bangular.io', config.imgurPass, config.imgurClient)

export default url => {

  return new Promise((resolve, reject) => {

    const stream = webshot(url, {
      phantomPath: '/usr/bin/phantomjs',
      renderDelay: 1e3,
      errorIfJSException: true
    })

    const chunks = []

    stream.on('data', chunk => chunks.push(chunk))

    stream.on('end', () => {
      const data = Buffer.concat(chunks).toString('base64')

      imgur.uploadBase64(data)
        .then(json => resolve(json.data.link))
        .catch(err => reject(err.message))
    })

  })

}
