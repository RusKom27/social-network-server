import "dotenv/config"

const MONGO_URL = process.env.LOCAL_MONGO_URL || ""
const SERVER_PORT = process.env.SERVER_PORT || '3000'

const config = {
    port: SERVER_PORT,
    mongo_url: MONGO_URL
}

export default config



