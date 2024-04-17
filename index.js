const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
const client = new MongoClient(uri, {});

// Search products
app.get("/search", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Buyly");
    const collection = database.collection("StoreProducts");

    const searchQuery = req.query.q; // Get search query from query parameter

    // Define the aggregation pipeline with search
    const agg = [
      {
        $search: {
          index: "storeProductsIndex",
          text: {
            query: searchQuery,
            path: { wildcard: "*" },
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
    ];

    const cursor = collection.aggregate(agg);
    const result = await cursor.toArray();

    res.status(200).json({
      products: result,
      message: "Products found successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// products autocomplete
app.get("/autocomplete", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("Buyly");
    const collection = database.collection("StoreProducts");

    const searchQuery = req.query.q; // Get search query from query parameter

    // Define the aggregation pipeline with search
    const agg = [
      {
        $search: {
          index: "storeProductsAutocomplete",
          autocomplete: {
            query: searchQuery,
            path: "name",
            fuzzy: {
              maxEdits: 1,
            },
          },
        },
      },
      { $limit: 10 },
      { $project: { _id: 0, name: 1 } },
    ];

    const cursor = collection.aggregate(agg);
    const result = await cursor.toArray();

    res.status(200).json({
      products: result,
      message: "Products found successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
