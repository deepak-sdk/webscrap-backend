import express from "express";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import dotenv from 'dotenv';

// const products =

dotenv.config();


const app = express();
const PORT = 8000;

app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("MongoDB Connected");
  return client;
}

export const client = await createConnection();

app.get("/", (req, res) => {
  res.send("Hello World🤑");
});

//GET ALL AMAZON_PRODUCTS

app.get("/products", async (req, res) => {
  const filter = req.query;

  const all_products = await client
    .db("hackathon")
    .collection("amazon_products")
    .find(filter)
    .toArray();
  res.send(all_products);
});

// GET PRODUCT BY ID
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product_id = await client
    .db("hackathon")
    .collection("amazon_products")
    .findOne({ _id: ObjectId(id) });
  res.send(product_id);
});

// CREATE PRODUCTS
app.post("/products", async (req, res) => {
  const data = req.body;
  const result = await client
    .db("hackathon")
    .collection("amazon_products")
    .insertMany(data);
  res.send(result);
});

// EDIT PRODUCTS BY ID
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const edit_product = await client
    .db("hackathon")
    .collection("amazon_products")
    .updateOne({ _id: ObjectId(id) }, { $set: data });
  res.send(edit_product);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const delete_product = await client
    .db("hackathon")
    .collection("amazon_products")
        .deleteOne({ _id: ObjectId(id) });
    res.send(delete_product)
});

app.listen(PORT, () => {
  console.log("App Started", PORT);
});
