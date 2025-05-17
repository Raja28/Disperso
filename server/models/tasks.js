
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true
    },
    tasks: [{
        firstName: String,
        phone: Number,
        notes: String
    }]
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
