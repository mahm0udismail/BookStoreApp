const express = require('express')
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;


//middlaware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})















// start to connect mongo

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://MARNBookStore:4Hf89zYymjHX9jx4@bookstoreapp.ks6he.mongodb.net/?retryWrites=true&w=majority&appName=BookStoreApp";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create a collection in documents
    const bookcollections = client.db("BookInventory").collection("books");

    // insert a book to the db with post method

    app.post("/uploadBook",async(req, res)=>{
      const data = req.body;
      const result = await bookcollections.insertOne(data)
      res.send(result)
    })

    // get all a books from db with get method
    app.get("/allBooks",async(req, res)=>{
      const books = bookcollections.find();
      const result = await books.toArray();
      res.send(result);
      
    })

    // updateBook from db with patch method
    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
          $set: {
              ...updateBookData
          }
      }
      const options = { upsert: true };

      // update now
      const result = await bookcollections.updateOne(filter, updatedDoc, options);
      res.send(result);
  })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// end to connect mongo



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})