const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const authController = require("./controllers/auth.js");
const recipesController = require("./controllers/recipes.js");
const ingredientsController = require("./controllers/ingredient.js");

const port = process.env.PORT ? process.env.PORT : "3000";

const Recipe = require("./models/recipes.js");
const path = require("path");
const communityController = require("./controllers/community.js");


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView); // Makes user data available to all views
app.use(express.static(path.join(__dirname, "public"))); // Serves static files

// Public routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.use("/auth", authController);
app.use("/recipes", recipesController);
app.use("/guest-index", (req, res) => {
  res.render("guest-index.ejs");
});

// Apply authentication middleware for protected routes
app.use(isSignedIn);

// Protected routes
app.use("/ingredientsList", ingredientsController);
app.use("/ingredients", ingredientsController);
app.use("/community", communityController);
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});