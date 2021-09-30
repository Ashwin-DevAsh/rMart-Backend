const multer = require("multer");

module.exports = class ProductsVideoController {

  getProductvideos = (req, res) => {
    var videoName = req.params.videoName;
    res.download("../productVideos/" + videoName);
  };
};
