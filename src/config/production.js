export default {

  env: 'production',

  port: 3004,
  socketPort: 3067,

  clientUrl: 'http://starveller.fugitive.link/',

  getApi: () => {
    return process.env.BROWSER
      ? '/api'
      : 'http://localhost:3004/api'
  }

}
