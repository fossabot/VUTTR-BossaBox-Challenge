require('dotenv').config()

var express = require('express')
var app = express()

app.use('/', require('./routes/index'))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Ouvindo a porta ${port}.`)
})
