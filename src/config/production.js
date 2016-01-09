export default {

  env: 'production',
  port: 3004,
  socketPort: 3067,

  getApi: () => {
    return process.env.BROWSER
      ? '/api'
      : 'http://localhost:3004/api'
  }

}
