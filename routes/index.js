var express = require("express");
var router = express.Router();
var multer = require("multer");
const path = require("path");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");
var imgModel = require("../database/database");
var HttpStatus = require('http-status-codes');
var response=require("./response");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        path.extname(file.originalname).toLowerCase()
    );
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 },
  fileFilter: (req, file, cb) => {
    const fileType = [".jpg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    console.log("ext:", ext);
    if (fileType.indexOf(ext) === -1) {
      req.err = "Images Only jpg/png";
      console.log("called");
      cb(null, false);
    } else {
      cb(null, true);
    }
  }
}).single("image");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/fileUpload", upload, async (req, res, next) => {
  console.log("file parameters:", req.file);
  
  if (req.err) {
    {
res.status(HttpStatus.CONFLICT).json(response.eResp(req.err));

    }
  } else if (req.file) {

res.status(HttpStatus.ACCEPTED).json(response.sResp('uploaded susscesfully',));

    //await imgModel.save();
    //do check the buffer size on console log of uploaded and imgesOpt folder for optimized image
    const files = await imagemin([req.file.path], {
      destination: "public/imagesOpt",
      plugins: [imageminJpegtran(), imageminOptipng()]
    });
    console.log("Images optimized", files);
    const imData = new imgModel();
    imData.imgName = req.file.filename;
    await imData.save();
  } else {

res.status(HttpStatus.CONFLICT).json(response.eResp('file not found'));
  }
});

router.get("/img-file-names", async (req, res) => {
  var imgObj = await imgModel.find();
  if(imgObj && imgObj.length)
res.status(HttpStatus.ACCEPTED).json(response.sResp({imgObj},'images found succesfully',));
  else
res.status(HttpStatus.BAD_REQUEST).json(response.eResp('No images are present in the database'));

});

module.exports = router;

