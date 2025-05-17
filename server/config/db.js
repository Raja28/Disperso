const { default: mongoose } = require("mongoose")
require("dotenv").config()
exports.connection = async (req, res) => {
    try {
        const resp = await mongoose.connect(process.env.MONGODB_URL)
        if (resp) {
            console.log("Disperso DB connected successfully");
        }
    } catch (error) {
        console.log("Error connecting Disperso DB :", error);

    }
}