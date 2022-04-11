

const sharp = require('sharp');
const uploadImage = require('../helpers/image_helpers');
const { data } = require('../middleware/logger');
const gc = require('../gc-config/')
const bucket = gc.bucket('dev-server-images-bucket')


exports.imagesUpload = async (req, res) => {
    try {
        const myFiles = req.files
        if (!req.body.media_key) {
            return res.status(400).send({
                message: "media_key is required"
            });
        }
        if (!req.files || !req.files.length) {
            return res.status(400).send({
                message: "At least one file required"
            });
        }
        let imageAllData = [];
        for (var i in myFiles) {
            var imageData = {};
            var myFile = myFiles[i];
            myFile.originalname = `${Date.now()}-${myFile.originalname}`;
            const imageUrl = await uploadImage(myFile)
            var url_parts = imageUrl.split('/');
            var imageName = url_parts.pop();  
            
            if (myFile.mimetype != 'video/mp4') {
                imageData['image_name'] = imageName;
                imageData['image_url'] = imageUrl;
                const thumbnail = {
                    fieldname: myFile.fieldname,
                    originalname: `thumbnail/${myFile.originalname}`,
                    encoding: myFile.encoding,
                    mimetype: myFile.mimetype,
                    buffer: await sharp(myFile.buffer).resize(465, 360).toBuffer()
                }
                const imagethumbnailUrl = await uploadImage(thumbnail);
                imageData['thumbnail_url'] = imagethumbnailUrl;
            } else {
                imageData['video_name'] = imageName;
                imageData['video_url'] = imageUrl;
            }
            imageAllData.push(imageData);
        }
        
        res.status(200).json({
            message: "Upload was successful",
            data: imageAllData
            //thumbnail: imagethumbnailUrl
          })
      } catch (error) {
        return res.status(500).send({
                        message: `Error when trying  file: ${error}`
                    });
      }
}

exports.deleteImage = async (req, res) => {
    try {
        var fileName = req.params.imageName;
        var thumbnailfileName = `thumbnail/${fileName}`
        await bucket.file(fileName).delete();
        var image_parts = fileName.split('.');
        var imageType = image_parts.pop();
        var imageMsg = ''; 
        if (imageType != "mp4") {
            console.log("sdddddddddddddddddddddddddd");
            imageMsg = "Image deleted";
            await bucket.file(thumbnailfileName).delete();
        } else {
            imageMsg = "Video deleted"
        }
        res.status(200).json({
            message: imageMsg
          });
    } catch (error) {
        return res.status(500).send({
                        message: `Error when deleting  file: ${error}`
                    });
        }
}