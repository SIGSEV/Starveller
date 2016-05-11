delete process.env.BROWSER

require('babel-register')
require('babel-polyfill')

const path = require('path')
const appModulePath = require('app-module-path')

appModulePath.addPath(path.resolve(__dirname, '../src'))

require('../src/server')
