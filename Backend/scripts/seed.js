require("dotenv").config();
const mongoose = require("mongoose");
const { mongoDB_URI } = require("../constants");
const {
  seedDatabaseIfEmpty,
  reseedDemoData,
  reseedAll,
} = require("../db/seed");

const shouldResetDemo = process.argv.includes("--reset");
const shouldResetAll = process.argv.includes("--full");

async function runSeed() {
  await mongoose.connect(mongoDB_URI);

  if (shouldResetAll) {
    await reseedAll();
  } else if (shouldResetDemo) {
    await reseedDemoData();
  } else {
    await seedDatabaseIfEmpty();
  }

  await mongoose.disconnect();
  console.log("Seed completed");
}

runSeed().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
