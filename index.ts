import config from "./config/config"
import mongoose from "mongoose"
import bodyParser from 'body-parser'
import express from 'express'

const cors = require('cors')
const logger = require('morgan')
const corsOptions = {
    credentials: true,
    optionSuccessStatus: 200
}

const app = express()

mongoose.connect(config.mongo_url).then(r => console.log('Connected to database...'))
mongoose.connection.on('error', (error: mongoose.Error) => console.error(error))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(express.static("public"))

app.use('/api/auth', require('./routes/authRouter'))
app.use('/api/user', require('./routes/userRouter'))
app.use('/api/post', require('./routes/postRouter'))
app.use('/api/message', require('./routes/messageRouter'))
app.use('/api/image', require('./routes/imageRouter'))
app.use('/api/search', require('./routes/searchRouter'))

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