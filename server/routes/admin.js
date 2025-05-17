const express = require("express")
const { addAgent, fetchList, uploadList } = require("../controllers/admin")
const { auth } = require("../middleware/auth")

const router = express.Router()

router.post("/addAgent", auth, addAgent)
router.get("/list", auth, fetchList)
router.post("/list",auth, uploadList)


module.exports = router