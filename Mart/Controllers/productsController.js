const Database = require("../Services/Database");
const client = require("../cache/redis")

class ProductsController {
  databaseService = new Database();

  getAllProducts = async (req, res) => {
    console.log("getProducts");

    var allProductsCache = await client.get("allProducts");
    try{
      await client.flushall("allProducts",console.log);
    }catch(e){
      console.error(e)
    }

    if (allProductsCache==null){
       var allProducts = await this.databaseService.getAllProducts();
       client.set("allProducts",JSON.stringify(allProducts))
    }else{
        console.log("cache hit")
        var allProducts = JSON.parse(allProductsCache)
    }

    if (allProducts) {
      console.log('allProducts')
      res.send({ message: "success", allProducts });
    } else {
    console.log("failed");
      res.send({ message: "failed" });
    }
  };

  deleteProduct = async (req, res) => {
    var { productID } = req.body;
    if (!productID) {
      res.send({ message: "error" });
    } else {
      var isDeleted = await this.databaseService.deleteProduct(productID);
      if (isDeleted) {
        res.send({ message: "success" });
      } else {
        res.send({ message: "failed" });
      }
    }
  };

  updateProduct = async (req, res) => {
    var {
      productID,
      productName,
      ownerID,
      discription,
      category,
      price,
      quantity,
      imageUrl,
      availableOn,
    } = req.body;

    if (
      !productID ||
      !productName ||
      !discription ||
      !category ||
      !ownerID ||
      !price ||
      !quantity ||
      !imageUrl ||
      !availableOn
    ) {
      res.send({ message: "error" });
    } else {
      var isUpdated = await this.databaseService.updateProduct(
        productID,
        productName,
        ownerID,
        discription,
        category,
        price,
        quantity,
        imageUrl,
        availableOn
      );
      if (isUpdated) {
        res.send({ message: "success" });
      } else {
        res.send({ message: "failed" });
      }
    }
  };

  addProducts = async (req, res) => {
    var {
      productID,
      productName,
      ownerID,
      discription,
      category,
      price,
      quantity,
      imageUrl,
      availableOn,
    } = req.body;

    if (
      !productID ||
      !productName ||
      !discription ||
      !category ||
      !ownerID ||
      !price ||
      !quantity ||
      !imageUrl ||
      !availableOn
    ) {
      res.send({ message: "error" });
    } else {
      var isAdded = await this.databaseService.addProducts(
        productID,
        productName,
        ownerID,
        discription,
        category,
        price,
        quantity,
        imageUrl,
        availableOn
      );
      if (isAdded) {
        res.send({ message: "success" });
      } else {
        res.send({ message: "failed" });
      }
    }
  };
}

module.exports = ProductsController;
