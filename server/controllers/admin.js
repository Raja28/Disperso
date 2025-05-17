const Agent = require("../models/agent")
const Task = require("../models/tasks")

exports.addAgent = async (req, res) => {
    try {
        let { name, contact_no, password, email } = req.body

        if (!name || !contact_no || !password || !email) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            })
        }


        email = email.trim().toLowerCase();

        const agentExists = await Agent.findOne({ email })

        if (agentExists) {
            return res.status(400).json({
                success: false,
                message: "Agent already exists"
            })
        }

        console.log("check 1");
        const newAgent = new Agent({ name, email, password, mobile: contact_no })
        await newAgent.save()
        console.log("check 2");
        const agent = newAgent.toObject()
        delete agent.password
        return res.status(200).json({
            success: true,
            message: "Agent added successfully",
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

exports.fetchList = async (req, res) => {

    try {
        const lists = await Task.find().populate("agentId")

        if (lists && lists.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Lists fetched successfully",
                lists
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "No list found"
            })
        }
    } catch (error) {
        console.error("Error fetching list:", error);
        return res.status(500).json({
            success: false,
            message: "Interal server error"
        })
    }
}

exports.uploadList = async (req, res) => {
    try {

        const { data } = req.body

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Data must be a non-empty array."
            });
        }

        // Fetch 5 agents
        const agents = await Agent.find().limit(5);
        if (agents.length < 5) {
            return res.status(400).json({
                success: false,
                message: "At least 5 agents required for distribution."
            });
        }
        await Task.deleteMany({});

        // Create 5 empty arrays to hold tasks for each agent
        const agentTasks = [[], [], [], [], []];

        // Distribute tasks equally first
        data.forEach((item, index) => {
            const task = {
                firstName: item.FirstName,
                phone: item.Phone,
                notes: item.Notes
            };

            const agentIndex = index % 5; // Distribute equally to 5 agents
            agentTasks[agentIndex].push(task);
        });

        //  If items are not divisible by 5, distribute remaining items sequentially
        const remainder = data.length % 5;
        if (remainder > 0) {
            for (let i = 0; i < remainder; i++) {
                const task = {
                    firstName: data[data.length - remainder + i].FirstName,
                    phone: data[data.length - remainder + i].Phone,
                    notes: data[data.length - remainder + i].Notes
                };
                agentTasks[i].push(task);
            }
        }

        // Save tasks to the database
        for (let i = 0; i < 5; i++) {
            await Task.create({
                agentId: agents[i]._id,
                tasks: agentTasks[i]
            });
        }


        res.status(200).json({
            success: true,
            message: "Tasks distributed and saved successfully."
        });

    } catch (error) {
        console.error("Error adding data:", error);
        return res.status(500).json({
            success: false,
            message: "Interal server error"
        })
    }
}