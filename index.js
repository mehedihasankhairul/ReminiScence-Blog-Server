const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const { ObjectID, ObjectId } = require("bson");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1eg3a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

    const BlogList = client.db(`${process.env.DB_NAME}`).collection("blogs")

    //Add  Order From Client
    app.post('/addBlog', (req, res) => {
        const newBlog = req.body;
        BlogList.insertOne(newBlog)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/blogs', (req, res) => {
        BlogList.find()
            .toArray((err, blogs) => {
                res.send(blogs)
            })
    })


    app.get("/blog/:id", (req, res) => {
        BlogList
            .find({ _id: ObjectID(req.params.id) })
            .toArray((err, blogs) => {
                res.send(blogs[0]);
            });
    });

    // Delete Route

    app.delete("/delete/:id", (req, res) => {
        BlogList
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
                console.log('delete done')
            });
    });

})


console.log('Connected')



app.get('/', (req, res) => {
    res.send('Server Is Running')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})