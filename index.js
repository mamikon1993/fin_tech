const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./src/routes/auth.router')
const cors = require('cors')
const app = express()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', 'views')
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use('/', authRouter)

async function start() {
  try {
    await mongoose.connect(process.env.DATABASE_URL)
    console.log(`Connection to DB success.`)

    const PORT = process.env.PORT
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
