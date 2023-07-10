const mongoose = require("mongoose");

MONGO_URI = "mongodb://127.0.0.1:27017/inotes";

const connectToMongo = async () => {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MONGO");
}

module.exports = connectToMongo;