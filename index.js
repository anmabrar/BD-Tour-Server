const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const { config } = require("dotenv");
const { ChangeStream } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bselz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const tourPackages = client.db("BDtour").collection("package");
  const bookingPackages = client.db("BDtour").collection("booking");

  // ad service

  app.post("/addPackages", async (req, res) => {
    const result = await tourPackages.insertOne(req.body);
    res.send(result);
  });

  // get all package
  app.get("/allPackage", async (req, res) => {
    const result = await tourPackages.find({}).toArray();
    res.send(result);
  });

  // get single package
  app.get("/bookingPackage/:id", async (req, res) => {
    const result = await tourPackages
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result[0]);
  });

  // cofirm order
  app.post("/confirmOrder", async (req, res) => {
    const result = await bookingPackages.insertOne(req.body);
    res.send(result);
  });

  // my confirmOrder

  app.get("/myOrders/:email", async (req, res) => {
    const result = await bookingPackages
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  /// delete order

  app.delete("/delteOrder/:id", async (req, res) => {
    const result = await bookingPackages.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  // all order
  app.get("/allOrders", async (req, res) => {
    const result = await bookingPackages.find({}).toArray();
    res.send(result);
  });

  // update statuses

  app.put("/updateStatus/:id", (req, res) => {
    const id = req.params.id;
    const updatedStatus = req.body.status;
    const filter = { _id: ObjectId(id) };
    console.log(updatedStatus);
    bookingPackages
      .updateOne(filter, {
        $set: { status: updatedStatus },
      })
      .then((result) => {
        res.send(result);
      });
  });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
