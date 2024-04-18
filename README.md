# Mongo Product Search API

This is a simple Express.js API that provides two endpoints for searching and autocompleting products from a MongoDB database.

## Prerequisites

- Node.js
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add your MongoDB connection string as `MONGODB_URI`
4. Start the server: `npm start`

## Endpoints

### 1. `/search`

This endpoint performs a text search on the `StoreProducts` collection in the `Buyly` database. It uses the `$search` aggregation pipeline stage with a wildcard text index (`storeProductsIndex`) and allows for fuzzy matching with a maximum of 2 edits.

**Query Parameters**

- `q` (required): The search query string

**Example Request**
GET /search?q=laptop

**Example Response**

```json
{
  "products": [
    {
      // product document
    }
  ],
  "message": "Products found successfully"
}
```

### 2. `/autocomplete`

This endpoint provides autocomplete suggestions for product names in the StoreProducts collection of the Buyly database. It uses the `$search` aggregation pipeline stage with an autocomplete index (`storeProductsAutocomplete`) and allows for fuzzy matching with a maximum of 1 edit.

**Query Parameters**

- `q` (required): The search query string

**Example Request**

GET /autocomplete?q=lap

**Example Response**

```json
{
  "products": [
    {
      "name": "Laptop Bag"
    },
    {
      "name": "Laptop Charger"
    }
  ],
  "message": "Products found successfully"
}
```

## Configuration

The MongoDB connection string is loaded from the `MONGODB_URI` environment variable. You can set this variable in the `.env` file or in your system's environment variables.

## Error Handling

If an error occurs during the MongoDB operation, the API will respond with a 500 Internal Server Error and an error message.

## Dependencies

- express: Web application framework for Node.js
- mongodb: Official MongoDB driver for Node.js
- cors: Middleware for enabling CORS in Express.js
- dotenv: Module for loading environment variables from a .env file
