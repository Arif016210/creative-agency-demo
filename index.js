const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbwel.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000

app.get('/', (req, res) => {
    res.send('Creative Agency!')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const agencyCollection = client.db("agencyDatabase").collection("agencyInfo");
    const orderCollection = client.db("agencyDatabase").collection("order");
    const reviewCollection = client.db("agencyDatabase").collection("review");

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order);
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/order', (req, res) => {
        // console.log(req.query.email)
        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.post('/addReview', (req, res) => {
        const review = req.body;
        // console.log(review);
        reviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/review', (req, res) => {
        // console.log(req.query.email)
        reviewCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


});






app.listen(port)