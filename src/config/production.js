export default {

  env: 'production',

  port: 3044,
  socketPort: 3067,

  clientUrl: 'http://starveller.sigsev.io/',
  apiUrl: 'http://starveller.sigsev.io/api',

  getApi: () => process.env.BROWSER ? '/api' : 'http://localhost:3044/api'

}
