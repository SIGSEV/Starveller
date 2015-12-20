import webpack from 'webpack'
import ProgressPlugin from 'webpack/lib/ProgressPlugin'

import webpackConfig from '../webpack/production'

const bundler = webpack(webpackConfig)

/* eslint-disable no-console */
const write = process.stdout.clearLine
  ? (msg) => {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(msg)
  }
  : ::console.log
/* eslint-enable no-console */

const progressPlugin = new ProgressPlugin((percentage, info) => {
  const msg = `${Math.round(percentage * 100)}% ${info}`
  write(msg)
})

bundler.apply(progressPlugin)

bundler.run((err, stats) => {
  /* eslint-disable no-console */
  if (err) { return console.log(err) }
  console.log(stats.toString(webpackConfig.stats))
  /* eslint-enable no-console */
})
