const app = require("express").Router();
const ProductsController = require("../Controllers/productsController");
const Auth = require("../Services/Auth");

var productsController = new ProductsController();

app.post("/updateProduct",new Auth().isMerchantKeyAuth ,productsController.updateProduct);

app.post("/addProducts",new Auth().isMerchantKeyAuth,productsController.addProducts);

app.post("/deleteProduct",new Auth().isMerchantKeyAuth,productsController.deleteProduct);

app.get("/getAllProducts",new Auth().isKeyAuth,productsController.getAllProducts);

app.get("/getMyProducts",new Auth().isKeyAuth,productsController.getMyProducts);


module.exports = app;
