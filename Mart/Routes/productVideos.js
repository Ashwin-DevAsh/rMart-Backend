const jwt = require("jsonwebtoken");
const app = require("express").Router();

const ProductsPictureController = require("../Controllers/productVideoController");

var productsPictureController = new ProductsPictureController();


app.get(
  "/getProductVideos/:imageName",
  productsPictureController.getProductPicture
);



module.exports = app;
