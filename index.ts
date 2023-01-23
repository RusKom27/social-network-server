import config from "./config/config"
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import express from 'express'
import cookieParser from "cookie-parser";

import {authRouter, userRouter, searchRouter, imageRouter, postRouter, messageRouter} from "./routes"

const cors = require('cors')
const logger = require('morgan')
const corsOptions = {
    credentials: true,
    optionSuccessStatus: 200
}

const app = express()

mongoose.set('strictQuery', false)
mongoose.connect(config.mongo_url).then(r => console.log('Connected to database...'))
mongoose.connection.on('error', (error: mongoose.Error) => console.error(error))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.json())

app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(express.static("public"))

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/message', messageRouter)
app.use('/api/image', imageRouter)
app.use('/api/search', searchRouter)

const debug = require('debug')('social_network:server')
const http = require('http')

const port = normalizePort(config.port)
app.set('port', port)

const server = http.createServer(app)

server.listen(port, () => console.log(`Server started: http://localhost:${process.env.PORT || '3000'}`))
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val: string) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false;
}

function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== 'listen') {
        throw error
    }
    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1)
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1)
            break
        default:
            throw error
    }
}

function onListening() {
    let addr = server.address()
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    debug('Listening on ' + bind)
}