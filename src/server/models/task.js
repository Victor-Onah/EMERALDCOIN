import mongoose from "mongoose";

const { Schema, connection } = mongoose;
const taskSchema = new Schema({
	type: {
		type: String,
		required: true,
		enum: ["daily", "one-off"]
	},
	rewardAmount: {
		type: Number,
		required: true
	},
	link: {
		type: String,
		default: "none"
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

const Task = connection.useDb("Emerald_Airdrop").model("task", taskSchema);

export default Task;
