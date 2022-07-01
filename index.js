const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./src/routes/auth.router')
const cors = require('cors')
const passport = require('passport')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', 'views')
app.get('/', (req, res) => {
  res.send('Hello world')
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', authRouter)
app.use(
  session({
    secret: '+',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())

app.use(passport.session())

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
