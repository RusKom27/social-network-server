require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database...'))

app.use(express.json())

const indexRouter = require('./routes/indexRouter')
const profileRouter = require('./routes/profileRouter')

app.use('/', indexRouter)
app.use('/profile', profileRouter)

app.listen(3000, () => console.log('Server started...'))
