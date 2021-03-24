const Database = require("../Services/Database");
const client = require("../cache/redis")

class ProductsController {
  databaseService = new Database();

  getAllProducts = async (req, res) => {

    var allProductsCache = await client.get("allProducts");

    if (allProductsCache==null){
       var allProducts = await this.databaseService.getAllProducts();
       client.set("allProducts",JSON.stringify(allProducts))
    }else{
        var allProducts = JSON.parse(allProductsCache)
    }

    if (allProducts) {
      res.send({ message: "success", allProducts });
    } else {
      res.send({ message: "failed" });
    }
  };

  getMyProducts = async (req, res) => {


    var allProducts = await this.databaseService.getMyProducts();
    

    if (allProducts) {
      res.send({ message: "success", allProducts });
    } else {
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
        await client.set("allProducts",JSON.stringify(await this.databaseService.getAllProducts()))
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
      isavailable,
      discount
    } = req.body;

    console.log(req.body)

    if (
      !productID ||
      !productName ||
      !discription ||
      !category ||
      !ownerID ||
      !price ||
      !quantity ||
      !imageUrl ||
      !availableOn==undefined ||
      !isavailable==undefined ||
      !discount==undefined
    ) {
      
      res.send({ message: "invalid body" });
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
        availableOn,
        isavailable,
        discount
      );
      if (isUpdated) {
        await client.set("allProducts",JSON.stringify(await this.databaseService.getAllProducts()))
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
      isavailable,
      discount
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
      !availableOn ||
      !isavailable ==undefined ||
      !discount==undefined
    ) {
      res.send({ message: "invalid body" });
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
        availableOn,
        isavailable,
        discount
      );
      if (isAdded) {
        await client.set("allProducts",JSON.stringify(await this.databaseService.getAllProducts()))
        res.send({ message: "success" });
      } else {
        res.send({ message: "failed" });
      }
    }
  };
}

module.exports = ProductsController;
