module.exports = app => {
  const image_upload = require("../controllers/image_upload.controller.js");
  var router = require("express").Router();
  require("dotenv").config();
  const auth = require("../middleware/auth");
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
//app.use(multerMid.single('file'))
app.use(multerMid.array('file', 12))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


 	/**
	* @swagger
	* /api/images-upload:
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
	*                            example: "additional_info_data,bonus_item:bonus_item_icons,bonus_product_images,bonus_set:bonus_set_icons,bonus_set_images"
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
  router.post("/images-upload", auth, image_upload.imagesUpload);

  /**
   * @swagger
   * /api/images-upload/{imageName}:
   *   delete:
   *     parameters:
   *         - name: imageName
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - File Upload
   *     description: Delete Image From GCP
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Image From GCP
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
  router.delete("/images-upload/:imageName", auth, image_upload.deleteImage); 

  app.use("/api", router);
};
