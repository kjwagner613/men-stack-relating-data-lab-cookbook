const mongoose = require('mongoose');


const recipeSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    timeToCook: {
      hours: {
        type: Number,
        required: true,
      },
      minutes: {
        type: Number,
        required: true,
      },
    },
    ingredients: {
      type: [String],
      required: true,
    },
  });
  

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
