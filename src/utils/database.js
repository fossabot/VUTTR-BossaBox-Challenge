const mongoose = require('mongoose')

module.exports = (DB_NAME = process.env.DB_NAME) => {
  const connectionURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${DB_NAME}?retryWrites=true`
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    w: 'majority'
  }

  return mongoose.connect(connectionURL, options, (err) => {
    if (!err) {
      console.log('Conexão com a database efetuada com sucesso.')
    } else {
      console.log('Ocorreu um erro ao tentar logar na database.')
    }
  })
}
