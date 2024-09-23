import mongoose from "mongoose";

const { Schema, connection } = mongoose;
const miningProgressSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	startTime: {
		type: Date,
		required: true
	},
	endTime: {
		type: Date,
		required: true
	},
	status: {
		type: String,
		required: true,
		enum: ["in-progress", "completed"]
	}
});

const MiningProgress = connection
	.useDb("Emerald_Airdrop")
	.model("mining_progress", miningProgressSchema);

export default MiningProgress;
