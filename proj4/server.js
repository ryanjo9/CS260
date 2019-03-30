const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');
console.log("connecting...");
//connect to the database
mongoose.connect('mongodb://localhost:27017/ideas', {
  useNewUrlParser: true
});

app.listen(3001, () => console.log('Server listening on port 3000!'));

const multer = require('multer')

const itemSchema = new mongoose.Schema({
  category: String,
  name: String,
  price: String,
  directions: String,
  googleDetails: String,
  description: String,
  when: String
})

const Item = mongoose.model('Item', itemSchema);

app.post('/api/items', async (req, res) => {
  const item = new Item({
    category: req.body.category,
    name: req.body.name,
    price: req.body.price,
    directions: req.body.directions,
    googleDetails: req.body.googleDetails,
    description: req.body.description,
    when: req.body.when
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    let item = await Item.findOne({
      _id: req.params.id
    });
    console.log("req.body.name", req.body.name);
    if (req.body.name) {
      console.log("changing name");
      item.name = req.body.name;
    }
    if (req.body.price) {
      item.price = req.body.price;
    }
    if (req.body.directions) {
      item.directions = req.body.directions;
    }
    if (req.body.googleDetails) {
      item.googleDetails = req.body.googleDetails;
    }
    if (req.body.description) {
      item.description = req.body.description;
    }
    if (req.body.when) {
      item.when = req.body.when;
    }
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all ideas in the database
app.get('/api/items', async (req, res) => {
  let response = {
    sports: [],
    hikes: [],
    drives: [],
    wut: [],
  }
  try {
    let items = await Item.find();
    for (i in items) {
      if (items[i].category === 'sports') {
        response.sports.push(items[i]);
      } else if (items[i].category === 'hikes') {
        response.hikes.push(items[i]);
      } else if (items[i].category === 'drives') {
        response.drives.push(items[i]);
      } else {
        response.wut.push(items[i]);
      }
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.deleteOne({
      _id: req.params.id
    });
    res.send("deleted");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});