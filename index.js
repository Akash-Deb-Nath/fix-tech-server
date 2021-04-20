const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5055

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhzwj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("fixTech").collection("services");
  const bookingCollection = client.db("fixTech").collection("bookings");
  const reviewsCollection = client.db("fixTech").collection("reviews");
  const adminsCollection = client.db("fixTech").collection("admins");
  console.log('Database connected successfully');

  app.get('/services', (req, res) => {
    servicesCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/orderList', (req, res) => {
    bookingCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/bookList', (req, res) => {
    const email = req.query.email;
    console.log(req.query.email)
    bookingCollection.find({ email: email })
      .toArray((err, items) => {
        console.log(items.length)
        res.send(items);
      })
  })



  app.get('/reviews', (req, res) => {
    reviewsCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/isAdmin', (req, res) => {
    const email = req.query.email;
    adminsCollection.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0);
    })
  })

  app.post('/addService', (req, res) => {
    const newService = req.body;
    servicesCollection.insertOne(newService)
      .then(result => {
        console.log('insertedCount', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/book', (req, res) => {
    const newBooking = req.body;
    bookingCollection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addReview', (req, res) => {
    reviewsCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/makeAdmin', (req, res) => {
    adminsCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    productCollection.deleteOne({ _id: id })
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})