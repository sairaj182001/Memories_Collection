const express = require("express")
const router = express.Router()
const User = require("../models/Users")

router.post("/update-user-details", async (req, res) => {
    try {
        const { user } = req.body

        const userFound = await User.findOne({ socialId: { $eq: user.sub } })
        if (!userFound) {
            const newUser = new User({
                socialId: user.sub,
                imageUrl: user.picture,
                email: user.email,
                fullName: user.name,
                username: user.nickname
            })
            await newUser.save()
        }
        res.status(200).json({ message: "Success" })
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = router
