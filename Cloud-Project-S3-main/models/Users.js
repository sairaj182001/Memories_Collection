const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    socialId: String,
    imageUrl: String,
    email: String,
    fullName: String,
    username: String,
    folders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Storage"
        }
    ]
})

module.exports = mongoose.model("User", UserSchema)
