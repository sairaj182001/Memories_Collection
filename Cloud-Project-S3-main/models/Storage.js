const mongoose = require("mongoose")

const StorageSchema = new mongoose.Schema({
    folderName: String,
    files: [
        {
            _id: false,
            fileName: String,
            src: String
        }
    ]
})

module.exports = mongoose.model("Storage", StorageSchema)