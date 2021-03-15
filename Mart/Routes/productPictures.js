const jwt = require("jsonwebtoken");
const app = require("express").Router();

const ProductsPictureController = require("../Controllers/productPictureController");

var productsPictureController = new ProductsPictureController();


app.get(
  "/getProductPictures/:imageName",
  productsPictureController.getProductPicture
);

app.get(
  "/getQrImages/:imageName",
  productsPictureController.getQrImages
);


module.exports = app;
