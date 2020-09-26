// https://zellwk.com/blog/jest-and-mongoose/

const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.promise = global.Promise

async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

async function dropAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    try {
      await collection.drop()
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running')) return
      console.log(error.message)
    }
  }
}

module.exports = {
  setupDB (DB_NAME, clearAfterEach = true) {
    // Connect to Mongoose
    beforeAll(async () => {
      const connectionURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${DB_NAME}?retryWrites=true`
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        w: 'majority'
      }
      await mongoose.connect(connectionURL, options)
    })

    if (clearAfterEach === true) {
      // Cleans up database between each test
      afterEach(async () => {
        await removeAllCollections()
      })
    }

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections()
      await mongoose.connection.close()
    })
  }
}
