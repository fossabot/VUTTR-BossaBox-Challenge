require('dotenv').config()
require('./utils/database')()

/** Environment Variables
 * COOKIES_SECRET
 * DB_USER
 * DB_PASS
 * DB_HOST
 * DB_NAME
 * GOOGLE_CLIENT_ID
 * GOOGLE_CLIENT_SECRET
 * GOOGLE_REDIRECT_URI
 * JWT_SECRET
 */

const jwt = require('jsonwebtoken')
const { resolve } = require('path')

const User = require('./models/user')

var cookieParser = require('cookie-parser')
var express = require('express')
var helmet = require('helmet')
var app = express()

app.set('public', resolve(__dirname, '../public'))

app.use(helmet())
app.use(cookieParser(process.env.COOKIES_SECRET))
app.use(express.json())

app.use('*', async (req, res, next) => {
  const authToken = req.signedCookies['auth-token']
  if (authToken) {
    try {
      const verified = jwt.verify(authToken, process.env.JWT_SECRET)
      if (typeof verified === 'object') {
        try {
          req.user = (await User.findById(verified._id)) || undefined
        } catch (e) { /* User id inválido */ }
      }
    } catch (e) { /* JWT Token inválido */ }
  }
  next()
})

app.use('/', require('./routes/index'))
app.use('/logout', require('./routes/logout'))
app.use('/oauth', require('./routes/oauth'))
app.use('/tools', require('./routes/tools'))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Ouvindo a porta ${port}.`)
})
