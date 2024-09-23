import mongoose from "mongoose";
import generateReferralCode from "../utils/generate-referral-code.js";

const { Schema, connection } = mongoose;
const userSchema = new Schema({
	telegramId: {
		type: String,
		required: true,
		unique: true
	},
	username: String,
	referralCode: {
		type: String,
		default: generateReferralCode
	},
	referredBy: {
		type: String,
		default: "none"
	},
	tonWallet: String,
	balance: {
		type: Number,
		default: 0.0
	},
	totalReferrals: {
		type: Number,
		default: 0
	},
	dateJoined: {
		type: Date,
		default: Date.now()
	}
});

const User = connection.useDb("Emerald_Airdrop").model("user", userSchema);

export default User;
