const { MongoClient } = require("mongodb");
require("dotenv").config();

// connect to your Atlas cluster
const uri = process.env.uri;
const client = new MongoClient(uri);
// Buyly.StoreProducts

async function run() {
  try {
    await client.connect();
    // set namespace
    const database = client.db("Buyly");
    const coll = database.collection("StoreProducts");

    // define pipeline
    const agg = [
      {
        $search: {
          index: "storeProductsIndex",
          text: {
            query: "Apples",
            path: {
              wildcard: "*",
            },
          },
        },
      },
    ];

    // run pipeline
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();

    console.log("result: ", result);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
