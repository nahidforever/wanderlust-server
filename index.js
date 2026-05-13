const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DB_URI;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("wanderlust-db");
    const destinationCollection = db.collection("destination");

    app.get("/destination", async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.send(result);
    });

    app.get("/destination/:id", async (req, res) => {
      const { id } = req.params;

      const result = await destinationCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
      console.log(result);
    });

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      const result = await destinationCollection.insertOne(destinationData);

      res.json(result);
    });

    app.patch("/destination/:id", async (req, res) => {
      const { id } = req.params;

      const updateData = req.body;

      const result = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.json(result);
    });

    app.delete("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server on running port ${PORT}`);
});
