import "dotenv/config";

const MONGO_URL = (process.env.DEVELOPE ? process.env.LOCAL_MONGO_URL : process.env.MONGO_URL) || "";
const SERVER_PORT = process.env.SERVER_PORT || '3000';
const CLIENT_URL = process.env.DEVELOPE ? process.env.LOCAL_CLIENT_URL : process.env.CLIENT_URL;

const config = {
    port: SERVER_PORT,
    client: CLIENT_URL,
    mongo_url: MONGO_URL,
    corsOptions: {
        credentials: true,
        origin: CLIENT_URL,
        optionSuccessStatus: 200,
    },
};

export default config;



