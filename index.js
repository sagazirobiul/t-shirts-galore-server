const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const port = process.env.PORT || 8000;
app.use(cors())
app.use(express.json())
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cvfa5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const tShirtsCollection = client.db(`${process.env.DB_NAME}`).collection("t-shirts");
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    tShirtsCollection.insertOne(newProduct)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/tShirts', (req, res) => {
    tShirtsCollection.find({})
    .toArray((err ,items) => {
      res.send(items)
    })
  })

  app.get('/tShirts/:id', (req, res) => {
    tShirtsCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err ,items) => {
      res.send(items[0])
    })
  })

  app.delete('/delete', (req, res) => {
    tShirtsCollection.findOneAndDelete({_id: ObjectId(req.query.id)})
    .then(result => {
      res.send(result.ok > 0)
    })
  })

  app.post('/addOrders', (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/orders', (req, res) => {
    ordersCollection.find({email: req.query.email})
    .toArray((err ,items) => {
      res.send(items)
    })
  })


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)