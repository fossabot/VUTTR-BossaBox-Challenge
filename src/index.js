require('dotenv').config()
require('./utils/database')()

const app = require('./server')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Ouvindo a porta ${port}.`)
})
