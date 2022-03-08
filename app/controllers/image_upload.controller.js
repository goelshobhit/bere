

const sharp = require('sharp');
const uploadImage = require('../helpers/image_helpers')


exports.imagesUpload = async (req, res) => {
    try {
        const myFile = req.file
        if (!req.body.media_key) {
            return res.status(400).send({
                message: "media_key is required"
            });
        }
        if (!req.file) {
            return res.status(400).send({
                message: "At least one file required"
            });
        }
        myFile.originalname = `${Date.now()}-${myFile.originalname}`;
        const imageUrl = await uploadImage(myFile)
        const thumbnail = {
            fieldname: myFile.fieldname,
            originalname: `thumbnail/${myFile.originalname}`,
            encoding: myFile.encoding,
            mimetype: myFile.mimetype,
            buffer: await sharp(myFile.buffer).resize(465, 360).toBuffer()
          }
        const imagethumbnailUrl = await uploadImage(thumbnail);
        res.status(200).json({
            message: "Upload was successful",
            data: imageUrl,
            thumbnail: imagethumbnailUrl
          })
      } catch (error) {
        return res.status(500).send({
                        message: `Error when trying  file: ${error}`
                    });
      }
}