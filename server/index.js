const express = require("express")
const app = express()
app.use(express.json())
require("dotenv").config()
PORT = process.env.PORT || 2026
const cors = require("cors")
app.use(cors({
    origin: "https://disperso-client.vercel.app/",
    credentials: true
}))

const authRouter = require("./routes/auth")
const adminRouter = require("./routes/admin")
const { connection } = require("./config/db")

app.use("/auth", authRouter)
app.use("/admin", adminRouter)

app.get("/disperso", (req, res) => {
    return res.json({
        success: "true",
        message: "Disperso server is running successfully."
    })
})
connection()
app.listen(PORT, () => {
    console.log("Disperso server is running on port:", PORT);
})