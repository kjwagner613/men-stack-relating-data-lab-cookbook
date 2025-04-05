const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Recipe = require("../models/recipes");

// Route to get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "username"); // Fetch all users with only the username field
    res.render("community/community.ejs", { users, user: req.session.user });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Route to get recipes by owner
router.get("/:ownerId", async (req, res) => {
  try {
    const owner = await User.findById(req.params.ownerId, "username"); // Fetch the owner's username
    const recipes = await Recipe.find({ owner: req.params.ownerId }); // Fetch recipes by owner ID
    res.render("community/owner-recipes.ejs", { owner, recipes, user: req.session.user });
  } catch (error) {
    console.log(error);
    res.redirect("/community");
  }
});

module.exports = router;