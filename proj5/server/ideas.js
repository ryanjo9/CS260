const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");

const users = require("./users.js");
const User = users.model;

const ideaSchema = new mongoose.Schema({
  category: String,
  title: String,
  price: String,
  directionsLink: String,
  reviewsLink: String,
  description: String,
  commonAge: Number,
  commonRelationship: Number,
  commonBudget: Number,
  numLikes: {
    type: Number,
    default: 1
  },
  numAges: {
    type: Number,
    default: 1
  },
  numRelationships: {
    type: Number,
    default: 1
  },
  numberBudgets: {
    type: Number,
    default: 1
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  create: {
    type: Date,
    default: Date.now
  }
})

const Idea = mongoose.model('Idea', ideaSchema);

router.post("/", auth.verifyToken, User.verify, async (req, res) => {
  const idea = new Idea({
    user: req.user,
    title: req.body.title,
    price: req.body.price,
    category: req.body.category,
    directionsLink: req.body.directionsLink,
    reviewsLink: req.body.reviewsLink,
    description: req.body.description,
  });
  if (req.user.age) {
    idea.commonAge = req.user.age;
  }
  if (req.user.relationshipStatus) {
    idea.commonRelationship = req.user.relationshipStatus;
  }
  if (req.user.budget) {
    idea.commonBudget = req.user.budget;
  }
  try {
    await idea.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//Get my ideas
router.get("/", auth.verifyToken, User.verify, async (req, res) => {
  try {
    let ideas = await Idea.find({
      user: req.user
    }).sort({
      created: -1
    });
    let response = await separate(ideas);
    return res.send(response)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all ideaSchema
router.get("/all", async (req, res) => {
  try {
    let ideas = await Idea.find().sort({
      created: -1
    }).populate('user');
    let results = await separate(ideas);
    return res.send(results);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/:id", auth.verifyToken, User.verify, async (req, res) => {
  try {
    let idea = await Idea.findOne({
      _id: req.params.id
    });
    const user = req.user;
    if (user.age) {
      idea.numAges++;
      idea.commonAge = ((idea.commonAge * (idea.numAges - 1)) + user.age) / idea.numAges;
    }
    if (user.relationshipStatus) {
      idea.numRelationships++;
      idea.commonRelationship = ((idea.commonRelationship * (idea.numRelationships - 1)) + idea.commonRelationship) / idea.numRelationships;
    }
    if (user.budget) {
      idea.numberBudgets++;
      idea.commonBudget = ((idea.commonBudget * (idea.numberBudgets - 1)) + idea.commonBudget) / idea.numberBudgets
    }
    idea.numLikes++;
    await idea.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

router.get("/suggestions", auth.verifyToken, User.verify, async (req, res) => {
  try {
    const user = req.user;
    let ideas = await Idea.find({
      user: req.user
    }).sort({
      numLikes: -1
    });
    let response = ideas.filter(item => {
      let age = user.age ? user.age : item.commonAge;
      let rs = user.relationshipStatus ? user.relationshipStatus : item.commonRelationship;
      let budget = user.budget ? user.budget : item.commonBudget;
      if (Math.abs(item.commonAge - age) < 5 && item.commonRelationship === rs && Math.abs(item.commonBudget - budget) < 15) {
        return item
      }
    })
    response = await separate(response);
    return res.send(response);
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

async function separate(ideas) {
  let response = {
    sports: [],
    hikes: [],
    drives: [],
    wut: [],
  }
  for (i in ideas) {
    if (ideas[i].category === 'sports') {
      response.sports.push(ideas[i]);
    } else if (ideas[i].category === 'hikes') {
      response.hikes.push(ideas[i]);
    } else if (ideas[i].category === 'drives') {
      response.drives.push(ideas[i]);
    } else {
      response.wut.push(ideas[i]);
    }
  }

  return response;
}
module.exports = {
  model: Idea,
  routes: router,
}