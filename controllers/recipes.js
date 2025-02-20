const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes.js');

// Route to render the form to add a new recipe
router.get('/new', (req, res) => {
  res.render('recipes/new.ejs');
});

// Route to display all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.render('recipes/index.ejs', { recipes });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Route to display a single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.render('recipes/show.ejs', { recipe });
  } catch (error) {
    console.log(error);
    res.redirect('/recipes');
  }
});
 
// tried new Recipe(req.body); but it didn't work so found this breakdown method
router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe({
      name: req.body.name,
      timeToCook: {
        hours: req.body.hours,
        minutes: req.body.minutes,
      },
      ingredients: req.body.ingredients.split(',').map(ingredient => ingredient.trim()),
    });
    await newRecipe.save();
    res.redirect('/recipes');
  } catch (error) {
    console.log(error);
    res.redirect('/recipes/new');
  }
});

module.exports = router;