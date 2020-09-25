require('dotenv').config()
require('./utils/database')()

/**
 * DB_USER
 * DB_PASS
 * DB_HOST
 * DB_NAME
 * COOKIES_SIGNATURE
 */

const cookieParser = require('cookie-parser')

var express = require('express')
var app = express()

app.use(cookieParser(process.env.COOKIES_SIGNATURE))

app.use('/', require('./routes/index'))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Ouvindo a porta ${port}.`)
})
