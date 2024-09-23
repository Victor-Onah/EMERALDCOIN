import mongoose from "mongoose";

const { Schema, connection } = mongoose;
const userTaskSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	taskId: {
		type: String,
		required: true
	},
	amountEarned: {
		type: Number,
		required: true
	},
	completedAt: {
		type: Date,
		default: Date.now()
	}
});

const UserTask = connection
	.useDb("Emerald_Airdrop")
	.model("user_task", userTaskSchema);

export default UserTask;
