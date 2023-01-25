import config from "./config/config"
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import express from 'express'
import cookieParser from "cookie-parser";

import router from "./routes"
import {errorMiddleware} from "./middlewares";

const cors = require('cors')
const logger = require('morgan')
const corsOptions = {
    credentials: true,
    origin: "http://localhost:3001",
    optionSuccessStatus: 200
}

const app = express()

mongoose.set('strictQuery', false)
mongoose.connect(config.mongo_url).then(r => console.log('Connected to database...'))
mongoose.connection.on('error', (error: mongoose.Error) => console.error(error))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(express.static("public"))
app.use(router)
app.use(errorMiddleware)

app.listen(
    config.port,
    () => console.log(`Server started on http://localhost:${config.port}`)
)


