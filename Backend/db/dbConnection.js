const mongoose = require("mongoose");
const { mongoDB_URI } = require("../constants");
const { seedDatabaseIfEmpty } = require("./seed");

async function connectWithDB() {
  if (!mongoDB_URI || mongoDB_URI === "undefined") {
    throw new Error(
      'MONGO_URI is missing. Set it in Backend/.env (example: mongodb://127.0.0.1:27017/shopcart)'
    );
  }

  await mongoose.connect(mongoDB_URI);
  await seedDatabaseIfEmpty();
}

module.exports = { connectWithDB };
