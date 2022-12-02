require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const logger = require('morgan')
const bodyParser = require('body-parser');

const corsOptions = {
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database...'))

app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(express.static("public"))
app.use(bodyParser.json())

app.use('/api/auth', require('./routes/authRouter'))
app.use('/api/user', require('./routes/userRouter'))
app.use('/api/post', require('./routes/postRouter'))
app.use('/api/message', require('./routes/messageRouter'))

const debug = require('debug')('social_network:server')
const http = require('http')

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false;
}

function onError(error) {
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
