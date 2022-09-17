const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");
// const { v4: uuid } = require("uuid");
// uuid();
//We install method-override to make an overridden request.
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const Product = require("../models/product");

mongoose
  .connect("mongodb://localhost:27017/cornerStore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN");
  })
  .catch((err) => {
    console.log("MONGO CONNECTION FAILED");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Helps us with our post request for our FORMMMM,
//to not return undefined
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("App is active on port 3000");
});

const categories = ["Fruits", "Vegetables", "Dairy", "Meats", "Frozen"];
//Pattern to wait for mongoose to load data.
app.get("/products", async (req, res) => {
  //Find everything
  const products = await Product.find({});
  //   console.log(products);
  //   res.send("All products!");
  res.render("../products/index", { products });
});
//////////////////////////////////
//FORMMMMMMM
app.get("/products/new", (req, res) => {
  res.render("../products/new");
});
app.post("/products", async (req, res) => {
  //   res.render("../products/new", { products });
  const newProduct = new Product(req.body);
  await newProduct.save();
  //   console.log(req.body);
  //   console.log(newProduct);
  //   res.send("creating product now!");
  res.redirect(`../products/${newProduct._id}`);
});
//////////////////////////////////
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  Product.findById(id);
  const product = await Product.findById(id);
  //   res.send("details page");
  res.render("../products/show", { product });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("../products/edit", { product });
});
//put/patch to UPDATE the values.
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  //   console.log(req.body);
  //   res.send("PUT DONE");
  res.redirect(`../products/${product._id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  //   res.send("deleted");
  res.redirect("../products");
});

app.get("/dog", (req, res) => {
  res.send("woof");
});
