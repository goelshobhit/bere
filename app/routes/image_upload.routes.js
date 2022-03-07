module.exports = app => {
  const image_upload = require("../controllers/image_upload.controller.js");
  var router = require("express").Router();
  require("dotenv").config();

const bodyParser = require('body-parser')
const multer = require('multer')


const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
});

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


 	/**
	* @swagger
	* /api/image-upload:
	*   post:
	*     requestBody:
	*        required: true
	*        content:
	*            multipart/form-data:
	*                schema:
	*                    type: object
	*                    properties:
	*                        file:
	*                            type: array
	*                            items:
	*                             type: string
	*                             format: binary
	*                        media_key:
	*                            type: string
	*                            example: "bonus_item:bonus_item_icons,bonus_product_images,bonus_set:bonus_set_icons,bonus_set_images"
	*     tags:
	*       - File Upload
	*     description: upload media like image
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: Media upload succesfully
	*       400:
	*         description: You must select file
	*       401:
	*          description: Unauthorized
	*          content:
	*              application/json:
	*                  schema:
	*                      type: object
	*                      properties:
	*                          message:
	*                              type: string
	*                              example: Authorisation Required
	*/
  router.post("/image-upload", image_upload.imagesUpload);
  app.use("/api", router);
};
