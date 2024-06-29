const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 9000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqmtelq.mongodb.net/?appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const jobsCollection = client.db("soloSphere").collection("servicesJobs");
    const bidsCollection = client.db("soloSphere").collection("servicesBids");

    // Get All Data Service jobs From db
    app.get("/servicesJobs", async (req, res) => {
      const result = await jobsCollection.find().toArray();
      res.send(result);
    });

    // Get a single data
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });

    // save a bid data in db
    app.post("/bid",async (req,res)=>{
      const bidData = req.body
      const result = await bidsCollection.insertOne(bidData)
      res.send(result)
    });

    // save a jobs data in db
    app.post('/job', async (req,res)=>{
      const jobData = req.body;
      const result = await jobsCollection.insertOne(jobData)
      res.send(result)
    });
    // get jobs user of spacic user 
    app.get('/jobs/:email', async (req,res)=>{
      const email = req.params.email;
      const query = {'buyer.email':email}
      const result = await jobsCollection.find(query).toArray()
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("solosphere is running");
});

app.listen(port, () => {
  console.log(`surver is running : ${port}`);
});
