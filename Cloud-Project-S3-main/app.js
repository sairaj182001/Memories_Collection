if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose")
const path = require("path")

const userRoutes = require("./routes/user.routes")
const opsRoutes = require("./routes/ops.routes")

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/memory"
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const db = mongoose.connection
db.on("error", console.error.bind(console, "Mongoose Connection Denied..."))
db.once("open", () => {
    console.log("Mongoose Connection Established...")
})

app.use(userRoutes)
app.use(opsRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "Client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "Client", "build", "index.html"));
    })
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
