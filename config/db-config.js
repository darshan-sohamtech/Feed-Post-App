const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URL


const databaseConnection = mongoose.connect(url)
    .then(() => {
        console.log('Database Connected');
    })
    .catch((e) => {
        console.log(e);
    })

module.exports = databaseConnection;