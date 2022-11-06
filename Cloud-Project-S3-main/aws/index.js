const aws = require("aws-sdk")
const multerS3 = require("multer-s3")

aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: process.env.REGION
})

const rekognition = new aws.Rekognition()

const deleteImage = async filename => {
    try {
        s3.deleteObject({ Bucket: process.env.BUCKET, Key: filename }).promise()
    } catch (err) {
        return err
    }
}

const generateParams = (name) => {
    return {
        Image: {
            S3Object: {
                Bucket: process.env.BUCKET,
                Name: `${name}`
            }
        }
    }
}

const s3 = new aws.S3()
const storage = multerS3({
    s3,
    acl: "public-read",
    bucket: process.env.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: "inline",
    key: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

module.exports = { storage, s3, deleteImage, rekognition, generateParams }
