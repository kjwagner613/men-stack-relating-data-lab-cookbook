const mongoose = require('mongoose');

const ingredientsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
});

const Ingredients = mongoose.model('Ingredients', ingredientsSchema);

module.exports = Ingredients;