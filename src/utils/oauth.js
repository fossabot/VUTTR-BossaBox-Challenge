// Google OAuth
const { google } = require('googleapis')

const GoogleOAuth = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
})

module.exports = {
  Google: {
    authUrl: GoogleOAuth.generateAuthUrl({
      access_type: 'offline',
      scope: 'email'
    }),
    getLoginIdentifier: async (code) => {
      try {
        const data = await GoogleOAuth.getToken(code)
        if (data.res.status !== 200) return { err: data.res }
        GoogleOAuth.setCredentials(data.tokens)
        var oauth2 = google.oauth2({
          auth: GoogleOAuth,
          version: 'v2'
        })
        const data1 = await oauth2.userinfo.v2.me.get()
        if (data1.err !== undefined || data1.status !== 200) {
          return { err: data1.err }
        }
        return { err: null, identifier: data1.data.email }
      } catch (err) {
        return { err }
      }
    }
  }
}
