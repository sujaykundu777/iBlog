import dotenv from 'dotenv';
import mongoose from 'mongoose';
import color from '../utils/chalk.js';
dotenv.config();

// mongoose options
const options = {
  useMongoClient: true,
  autoIndex: false,
  poolSize: 10,
  bufferMaxEntries: 0
};

// mongodb environment variables
const {
    MONGO_HOSTNAME,
    MONGO_DB,
    MONGO_PORT
} = process.env;

const dbConnectionURL = {
     'LOCAL_DB_URL': `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`,
     'REMOTE_DB_URL': process.env.MONGODB_URI
};

mongoose.connect(dbConnectionURL.LOCAL_DB_URL, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, color.red('DB: Mongodb Connection Error:' + dbConnectionURL.LOCAL_DB_URL)));
db.once('open', () => {
     // we're connected !
     console.log(color.yellowBright('DB: Mongodb Connection Successful'));
});

export default db;