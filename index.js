const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.foyjr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const tCollection = client.db("tool-manufracturer").collection("tools");
    const rCollection = client.db("tool-manufracturer").collection("reviews");
    const oCollection = client.db("tool-manufracturer").collection("orders");

    // Items
    app.get("/tool", async (req, res) => {
      const query = {};
      const cursor = tCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });

    // Reviews
    app.get("/review", async (req, res) => {
      const query1 = {};
      const cursor = rCollection.find(query1);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // Get specific user
    app.get("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tool = await tCollection.findOne(query);
      res.send(tool);
    });

    // POST
    app.post("/order", async (req, res) => {
      const newOrder = req.body;
      const result = await oCollection.insertOne(newOrder);
      res.send(result);
    });

    // POST
    app.post("/review", async (req, res) => {
      const newRview = req.body;
      const result = await rCollection.insertOne(newRview);
      res.send(result);
    });

    // GET
    app.get("/order", async (req, res) => {
      const query1 = {};
      const cursor = oCollection.find(query1);
      const orders = await cursor.toArray();
      res.send(orders);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Run laptop");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
