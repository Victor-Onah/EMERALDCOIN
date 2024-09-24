import MiningProgress from "../models/mining-progress.js";
import User from "../models/user.js";
import UserTask from "../models/user-task.js";
import { config } from "dotenv";
import MiningController from "./mining-controller.js";

config();

const { TELEGRAM_BOT_TOKEN } = process.env;

export default class UserController {
	// Handler for fetching user
	static async getUser(req, res) {
		const { id } = req.params;
		const user = await User.findOne({ telegramId: id }, "-id -v");

		if (!user) return res.sendStatus(404);

		const balance = await UserController.#computeBalance(id);

		user.balance = balance;

		res.json({
			...user.toObject(),
			firstTimer: await MiningController.isNewUser(id),
			isMining: await MiningController.isMining(id)
		});

		await user.save();
	}

	// Get user friends
	static async getFriends(req, res) {
		console.log("Running");
		const { code } = req.query;
		const friends = await User.find({ referredBy: code }).select(
			"username telegramId"
		);

		res.json(friends);
	}

	// Handler for Telegram
	static async handleCommand(req, res) {
		const { message } = req.body;
		const { chat, text } = message;

		if (message && text) {
			const { username, first_name, last_name, id, is_bot, type } = chat;

			if (is_bot || ["supergroup", "group", "channel"].includes(type)) {
				await UserController.#sendMessage(
					id,
					"Only user accounts may use this bot."
				);
			} else if (text.startsWith("/start")) {
				// Extract referral code from the text
				const matches = text.match(/[a-zA-Z0-9]{10}$/);

				// Check if it's a referral
				if (matches) {
					const referrer = await User.findOne({
						referralCode: matches[0]
					});

					if (referrer) {
						++referrer.totalReferrals;

						await referrer.save();
					}
				}

				// Save the user if they have not been saved
				await UserController.#saveUser({
					telegramId: id,
					username,
					lastName: last_name,
					firstName: first_name,
					referredBy: matches ? matches[0] : undefined
				});

				// Send welcome message
				await UserController.#sendMessage(
					id,
					`👋 Hello ${username}.\nWelcome to the $Emerald Miner Bot! 🚀\n\nThis bot allows you to mine and earn $Emerald directly from Telegram.\n\n- Start mining $Emerald! ⛏️\n- Track your progress in real-time.\n- Earn bonuses for referrals and tasks.`,
					[
						[
							{
								text: "Start Mining",
								web_app: {
									url: `https://emeraldcoin.onrender.com/?id=${id}`
								}
							}
						]
					]
				);
			} else {
				switch (text) {
					case "/mine":
						// Save the user if they have not been saved
						await UserController.#saveUser({
							telegramId: id,
							lastName: last_name,
							firstName: first_name,
							username
						});

						(await MiningController.startNewMiningSession(id))
							? await UserController.#sendMessage(
									id,
									"A new mining session was started successfully 🚀"
							  )
							: await UserController.#sendMessage(
									id,
									"Your current session has not expired 😊"
							  );
						break;

					case "/balance":
						const balance = await UserController.#computeBalance(
							id
						);
						await UserController.#sendMessage(
							id,
							`**Account Summary**\n\nBalance: ${balance} $EMD\nTimestamp: ${new Date().toDateString()}`
						);
						break;

					default:
						await UserController.#sendMessage(
							id,
							`**Hello ${username}**\n\n Here are available commands you can give me:\n- /start\n- /mine\n- /balance`
						);
						break;
				}
			}
		}

		res.sendStatus(200);
	}

	// Save new user to database
	static async #saveUser(userInfo) {
		const { telegramId } = userInfo;
		const existingUser = await User.exists({ telegramId });

		if (!existingUser) {
			// No user, continue to save the new user data
			await User.create(userInfo);
		}
	}

	// Send message to telegram user
	static async #sendMessage(chat_id, text, keyboard = null) {
		const body = {
			chat_id,
			text,
			parse_mode: "Markdown"
		};

		if (keyboard) {
			body.reply_markup = { inline_keyboard: keyboard };
		}

		await fetch(
			`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			}
		);
	}

	// compute user balance
	static async #computeBalance(id) {
		const ratePerReferral = 5_000;
		const ratePerSecond = 10;
		const ratePerHour = 360_000;
		const user = await User.findOne({ telegramId: id });
		const userTasks = await UserTask.find({ userId: id });
		const miningSessions = await MiningProgress.find({ userId: id });
		const count = Math.max(userTasks.length, miningSessions.length);
		let balance = 0;

		if (!user) return balance.toFixed(2);

		for (let i = 0; i < count; i++) {
			const task = userTasks[i];
			const miningSession = miningSessions[i];

			if (task) balance += task.amountEarned;
			if (miningSession) {
				const { startTime, endTime } = miningSession;

				if (miningSession.status === "completed")
					balance += ratePerHour * 4;
				else {
					const timeDone = Math.floor(
						(Date.now() - startTime) / 1000
					); // convert to seconds

					balance += timeDone * ratePerSecond;
				}
			}
		}

		balance += user.totalReferrals * ratePerReferral;

		user.balance = balance;

		// Update user's balance
		await user.save();

		return balance.toFixed(2);
	}
}
