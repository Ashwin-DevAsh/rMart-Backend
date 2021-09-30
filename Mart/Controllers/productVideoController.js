const multer = require("multer");

module.exports = class ProductsVideoController {

  getProductVideos = (req, res) => {
    var videoName = req.params.videoName;
    res.download("../productVideos/" + videoName);
  };
};
