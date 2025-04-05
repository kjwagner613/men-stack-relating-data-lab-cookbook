const express = require("express");
const router = express.Router();
const Ingredient = require("../models/ingredient.js");

router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.render("ingredients/index.ejs", {
      ingredients,
      user: req.session.user,
      req,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  res.render("ingredients/new.ejs", { user: req.session.user, req });
});

router.post("/", async (req, res) => {
  try {
    const newIngredient = new Ingredient({
      name: req.body.name,
    });
    await newIngredient.save();
    res.redirect("/ingredients");
  } catch (error) {
    console.log(error);
    res.redirect("/ingredients/new");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    res.render("ingredients/show.ejs", {
      ingredient,
      user: req.session.user,
      req,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/ingredients");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    res.render("ingredients/edit.ejs", {
      ingredient,
      user: req.session.user,
      req,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/ingredients");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedIngredient = {
      name: req.body.name,
    };
    await Ingredient.findByIdAndUpdate(req.params.id, updatedIngredient);
    res.redirect(`/ingredients/${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.redirect("/ingredients");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.redirect("/ingredients");
  } catch (error) {
    console.log(error);
    res.redirect("/ingredients");
  }
});

module.exports = router;
