const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Recipe = require("../models/recipes");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "username");
    res.render("community/community.ejs", { users, user: req.session.user });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:ownerId", async (req, res) => {
  try {
    const owner = await User.findById(req.params.ownerId, "username");
    const recipes = await Recipe.find({ owner: req.params.ownerId });
    res.render("community/owner-recipes.ejs", {
      owner,
      recipes,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/community");
  }
});

module.exports = router;
