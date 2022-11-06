const express = require("express")
const router = express.Router()
const User = require("../models/Users")
const Storage = require("../models/Storage")
const validateUser = require("../middlewares/user.validator")
const { s3, rekognition, deleteImage, generateParams } = require("../aws")

const multer = require("multer")
const { storage } = require("../aws")
const upload = multer({ storage })

router.get("/get-folders", ...validateUser(), async (req, res) => {
    const { userId } = req.query
    try {
        const user = await User.findOne({ socialId: { $eq: userId } }).populate({ path: 'folders' })
        if (!user) throw "Their is no user with this Id."

        res.status(200).json({ message: "Retrived", folders: user.folders.reverse() })
    }
    catch (err) {
        console.log(err)
        res.status(403).json({ message: err })
    }
})

router.get("/get-files", ...validateUser(), async (req, res) => {
    const { userId, folderId } = req.query
    try {
        const user = await User.findOne({ socialId: { $eq: userId } }).populate({ path: 'folders' })
        if (!user) throw "Their is no user with this Id."

        const files = user.folders.filter(folder => folder._id.equals(folderId))[0].files

        res.status(200).json({ message: "Retrived", files })
    }
    catch (err) {
        console.log(err)
        res.status(403).json({ message: err })
    }
})

router.post("/create-new-folder", ...validateUser(), async (req, res) => {
    const { folderName, id } = req.body
    try {
        const user = await User.findOne({ socialId: { $eq: id } }).populate({ path: 'folders' })
        if (!user) throw "Their is no user with this Id."

        const folders = user.folders
        const isExist = folders.find(folder => folder.folderName == folderName)
        if (isExist) throw "There is already a folder with this name."

        const newFolder = new Storage({ folderName })
        user.folders.push(newFolder)
        await newFolder.save()
        await user.save()

        res.status(200).json({ message: "Created" })
    }
    catch (err) {
        console.log(err)
        res.status(403).json({ message: err })
    }
})

router.post("/upload-file", ...validateUser(), upload.single("file"), async (req, res) => {
    const { id, folderId } = req.body
    const { key, location } = req.file
    try {
        const params = generateParams(key)
        rekognition.detectModerationLabels(params, async (err, data) => {
            if (err || data.ModerationLabels.length) {
                await deleteImage(key)
                res.status(403).json({ message: "Uploaded media contents offensive content" })
            }
            else {
                const user = await User.findOne({ social: { $eq: id } })
                if (!user) throw "Their is no user with this Id."

                const _folder = await Storage.findOne({ _id: { $eq: folderId } })
                if (!_folder) throw "Their is no folder with this identifier."

                _folder.files.push({ fileName: key, src: location })
                await _folder.save()
                res.status(200).json({ message: "Uploaded", fid: _folder._id })
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
})

router.post("/change-folder-name", ...validateUser(), async (req, res) => {
    const { name, userId, folderId } = req.body
    try {
        const user = await User.findOne({ socialId: { $eq: userId } }).populate({ path: 'folders' })
        if (!user) throw "Their is no user with this userId."

        const isExist = user.folders.find(folder => folder._id.equals(folderId))
        if (!isExist) throw "You don't have access to rename this folder"

        const folder = await Storage.findOne({ _id: { $eq: folderId } })
        folder.folderName = name
        await folder.save()

        res.status(200).json({ message: "Change Done!!" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
})

router.post("/delete-folder", ...validateUser(), async (req, res) => {
    const { folderId, userId } = req.body
    try {
        const user = await User.findOne({ socialId: { $eq: userId } })
        if (!user) throw "Their is no user with this userId."

        const isExist = user.folders.find(folder => folder.equals(folderId))
        if (!isExist) throw "You don't have access to delete this folder."

        const folder = await Storage.findOneAndDelete({ _id: folderId })
        const folders = user.folders.filter(folder => !folder.equals(folderId))
        const objects = folder.files.map(file => ({ Key: file.fileName }))
        await User.findOneAndUpdate({ socialId: { $eq: userId } }, { $set: { folders } })
        if (objects.length)
            s3.deleteObjects({ Bucket: process.env.BUCKET, Delete: { Objects: objects } }).promise()

        res.status(200).json({ message: "Deleted" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
})

module.exports = router
