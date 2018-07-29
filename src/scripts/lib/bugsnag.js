import bugsnag from 'bugsnag-js'

export default bugsnag({
  apiKey: process.env.BUGSNAG_API_KEY,
  appVersion: process.env.APP_VERSION
})
