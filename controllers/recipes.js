const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipes.js");
const Ingredient = require("../models/ingredient.js");

router.get("/", async (req, res) => {
  try {
    let recipes;

    if (req.query.filter === "mine") {
      recipes = await Recipe.find({ owner: req.session.user._id }).populate(
        "owner"
      );
    } else if (req.query.filter === "others") {
      recipes = await Recipe.find({
        owner: { $ne: req.session.user._id },
      }).populate("owner");
    } else {
      recipes = await Recipe.find({}).populate("owner");
    }

    const flashMessage = req.session.flash?.message || null;
    req.session.flash = null;

    res.render("recipes/index.ejs", {
      recipes,
      flashMessage,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  try {
    const allIngredients = await Ingredient.find({});
    res.render("recipes/new.ejs", {
      user: req.session.user,
      allIngredients,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/recipes");
  }
});

router.post("/", async (req, res) => {
  try {
    const existingIngredientIds = Array.isArray(req.body.ingredientIds)
      ? req.body.ingredientIds
      : req.body.ingredientIds
      ? [req.body.ingredientIds]
      : [];

    const newIngredientIds = [];
    const newIngredientsRaw = req.body.newIngredients;

    if (newIngredientsRaw && newIngredientsRaw.trim() !== "") {
      const newNames = newIngredientsRaw
        .split(",")
        .map((name) => name.trim().toLowerCase())
        .filter((name) => name.length > 0);

      for (const name of newNames) {
        let ingredient = await Ingredient.findOne({ name });
        if (!ingredient) {
          ingredient = await Ingredient.create({ name });
        }
        newIngredientIds.push(ingredient._id);
      }
    }

    const combinedIngredients = [...existingIngredientIds, ...newIngredientIds];

    const newRecipe = new Recipe({
      name: req.body.name,
      instructions: req.body.instructions,
      owner: req.session.user._id,
      ingredients: combinedIngredients,
    });

    await newRecipe.save();

    req.session.flash = {
      message: `Recipe created successfully with ${
        newIngredientIds.length
      } new ingredient${newIngredientIds.length !== 1 ? "s" : ""}!`,
    };

    res.redirect("/recipes");
  } catch (error) {
    console.error(error);
    res.redirect("/recipes/new");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("ingredients");
    res.render("recipes/show.ejs", {
      recipe,
      user: req.session.user,
      req,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/recipes");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("ingredients");
    res.render("recipes/edit.ejs", {
      recipe,
      user: req.session.user,
      req,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/recipes");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedRecipe = {
      name: req.body.name,
      instructions: req.body.instructions,
      ingredients: req.body.ingredients
        .split(",")
        .map((ingredient) => ingredient.trim()),
    };
    await Recipe.findByIdAndUpdate(req.params.id, updatedRecipe);
    res.redirect(`/recipes/${req.params.id}`);
  } catch (error) {
    console.log(error);
    res.redirect("/recipes");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.redirect("/recipes");
  } catch (error) {
    console.log(error);
    res.redirect("/recipes");
  }
});

module.exports = router;
