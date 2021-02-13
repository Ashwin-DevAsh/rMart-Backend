const app = require("express").Router();
const ProductsController = require("../Controllers/productsController");

var productsController = new ProductsController();

app.post("/updateProduct",new Auth().isKeyAuth ,productsController.updateProduct);

app.post("/addProducts",new Auth().isKeyAuth,productsController.addProducts);

app.post("/deleteProduct",new Auth().isKeyAuth,productsController.deleteProduct);

app.get("/getAllProducts",new Auth().isKeyAuth,productsController.getAllProducts);

module.exports = app;
