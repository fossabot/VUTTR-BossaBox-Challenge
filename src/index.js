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

const cookieParser = require('cookie-parser')

var express = require('express')
var app = express()

app.use(cookieParser(process.env.COOKIES_SECRET))

app.use('*', (req, res, next) => {
  req.user = undefined
  next()
})

app.use('/', require('./routes/index'))
app.use('/oauth', require('./routes/oauth'))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Ouvindo a porta ${port}.`)
})
