import express from "express";
import ViteExpress from "vite-express";
import helmet from "helmet";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

// User schema for database
const userSchema = new mongoose.Schema({
	name: {
		type: {
			firstName: String,
			lastName: String
		},
		id: false,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	chatId: {
		type: String,
		required: true,
		unique: true
	},
	tasksCompleted: {
		type: [String],
		default: []
	},
	miningTimelines: {
		type: [
			{
				startTime: {
					type: Date,
					required: true
				},
				endTime: {
					type: Date,
					required: true
				}
			}
		],
		id: false,
		default: []
	},
	referrals: {
		type: [{ username: String, id: String }],
		default: [],
		id: false
	},
	firstTimer: {
		type: Boolean,
		default: true
	}
});

const app = express();
const APP_LIVE_URL = "https://emeraldcoin.onrender.com";
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const PORT = parseInt(process.env.PORT || "3000");
const DB_URL = process.env.DB_URL;
const MINING_RATE_PER_MILLISECOND = 100_000 / 3_600_000;
const EARNING_PER_TASK = 10_000;
const EARNING_PER_REFERRAL = 20_000;
const _6_HOURS = 21.6e6;
const User = mongoose.connection
	.useDb("Emerald_Airdrop")
	.model("user", userSchema);

// Compute user balance
const computeBalance = async ({ chatId, user = null }) => {
	user = user || (await User.findOne({ chatId }));
	if (!user) return 0;

	const { miningTimelines, tasksCompleted, referrals } = user;
	const totalCoinsEarnedFromTasks = tasksCompleted.length * EARNING_PER_TASK;
	const totalEarningsFromReferrals = referrals.length * EARNING_PER_REFERRAL;

	let totalCoinsEarnedFromMining = 0;
	for (const { startTime, endTime } of miningTimelines) {
		const end = Date.now() < endTime ? Date.now() : endTime;
		totalCoinsEarnedFromMining +=
			(end - startTime) * MINING_RATE_PER_MILLISECOND;
	}

	return (
		totalCoinsEarnedFromMining +
		totalCoinsEarnedFromTasks +
		totalEarningsFromReferrals
	);
};

// Start new mining session
const startNewMiningSession = async chatId => {
	const user = await User.findOne({ chatId });
	if (!user) return null;

	const lastSession = user.miningTimelines[user.miningTimelines.length - 1];
	if (lastSession && Date.now() < lastSession.endTime) return null;

	user.miningTimelines.push({
		startTime: Date.now(),
		endTime: Date.now() + _6_HOURS
	});

	await user.save();
	return true;
};

// Save new user
const saveUser = async userInfo => {
	try {
		const user = await User.findOne({ chatId: userInfo.chatId });
		if (user) return;

		await new User(userInfo).save();
	} catch (error) {
		console.error(error);
	}
};

// Connect to database
const connectToDatabase = async () => {
	try {
		await mongoose.connect(DB_URL);
		console.log("Connected to database successfully!");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

// Send message to Telegram
const sendMessage = async (chatId, text, keyboard = null) => {
	const body = {
		chat_id: chatId,
		text,
		parse_mode: "Markdown"
	};

	if (keyboard) {
		body.reply_markup = { inline_keyboard: keyboard };
	}

	try {
		await fetch(`${TELEGRAM_API}/sendMessage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});
	} catch (error) {
		console.error(error);
	}
};

// Handle bot commands
const handleCommand = async (chatId, command, username) => {
	switch (command) {
		case "/start":
			await sendMessage(
				chatId,
				`👋 Welcome to the $Emerald Miner Bot! 🚀\n\nThis bot allows you to mine and earn $Emerald directly from Telegram.\n\n- Start mining $Emerald! ⛏️\n- Track your progress in real-time.\n- Earn bonuses for referrals and tasks.`,
				[
					[
						{
							text: "Start Mining",
							web_app: {
								url: `${APP_LIVE_URL}/?chatId=${chatId}`
							}
						}
					]
				]
			);
			break;

		case "/mine":
			(await startNewMiningSession(chatId))
				? await sendMessage(
						chatId,
						"A new mining session was started successfully 🚀"
				  )
				: await sendMessage(
						chatId,
						"Your current session has not expired 😊"
				  );
			break;

		case "/balance":
			const balance = await computeBalance({ chatId });
			await sendMessage(
				chatId,
				`**Account Summary**\n\nBalance: ${balance.toFixed(
					2
				)} $EMD\nTimestamp: ${new Date().toUTCString()}`
			);
			break;

		default:
			if (/.*[\d]+$/.test(command)) {
				const [referrerId] = command.match(/.*[\d]+$/);
				const user = await User.findOne({ chatId: referrerId });

				if (user) {
					user.referrals.push({ username, id: chatId });

					await user.save();
				}

				return await sendMessage(
					chatId,
					`👋 Welcome to the $Emerald Miner Bot! 🚀\n\nThis bot allows you to mine and earn $Emerald directly from Telegram.\n\n- Start mining $Emerald! ⛏️\n- Track your progress in real-time.\n- Earn bonuses for referrals and tasks.`,
					[
						[
							{
								text: "Start Mining",
								web_app: {
									url: `${APP_LIVE_URL}/?chatId=${chatId}`
								}
							}
						]
					]
				);
			}

			await sendMessage(
				chatId,
				`**Welcome to $Emerald Miner Bot!**\n\nAvailable commands:\n- /start: Start the bot.\n- /mine: Start mining.\n- /balance: Check balance.`
			);
			break;
	}
};

// Middleware for security, parsing, and CORS
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: [
					"'self'",
					"https://telegram.org",
					"https://*.telegram.org"
				],
				frameSrc: ["'self'", "https://web.telegram.org"],
				frameAncestors: ["'self'", "https://web.telegram.org"],
				connectSrc: [
					"'self'",
					"https://api.telegram.org",
					"https://*.telegram.org"
				],
				styleSrc: ["'self'", "'unsafe-inline'"],
				clipboardRead: ["'self'"],
				clipboardWrite: ["'self'"]
			}
		},
		referrerPolicy: {
			policy: "no-referrer-when-downgrade"
		}
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: ["https://web.telegram.org", "https://t.me"],
		methods: "GET,POST"
	})
);

// API routes
app.put("/api/user/:chatId/new-mining-session", async (req, res) => {
	(await startNewMiningSession(req.params.chatId))
		? res.sendStatus(201)
		: res.sendStatus(503);
});

app.get("/api/user/:chatId", async (req, res) => {
	try {
		const { chatId } = req.params;
		const user = await User.findOne({ chatId });
		const lastMiningSession =
			user.miningTimelines[user.miningTimelines.length - 1];

		res.json({
			...user.toObject(),
			balance: await computeBalance({ chatId, user }),
			timestamp: Date.now(),
			isMining: lastMiningSession
				? Date.now() < lastMiningSession.endTime
				: false
		});
	} catch (error) {
		res.sendStatus(500);
	}
});

app.put("/api/user/:chatId/update", async (req, res) => {
	try {
		const { chatId } = req.params;
		const user = await User.findOne({ chatId });
		const { updates } = req.body;

		for (let update in updates) {
			user[update] = updates[update];
		}

		await user.save();

		res.sendStatus(201);
	} catch (error) {
		res.sendStatus(500);
	}
});

// Ping endpoint to keep server active
app.get("/ping", (req, res) => res.sendStatus(200));

// Telegram webhook
app.post("/telegram-webhook", async (req, res) => {
	const { message } = req.body;
	if (message && message.text) {
		const {
			chat: {
				id: chatId,
				type: chatType,
				is_bot: isBot,
				first_name: firstName,
				last_name: lastName,
				username
			}
		} = message;

		if (isBot || ["channel", "group", "supergroup"].includes(chatType)) {
			await sendMessage(chatId, "Only user accounts may use this bot.");
		} else {
			await handleCommand(chatId, message.text.toLowerCase(), username);
			await saveUser({ name: { firstName, lastName }, username, chatId });
		}
	}

	res.sendStatus(200);
});

// Start the server
ViteExpress.listen(app, PORT, async () => {
	console.log(`Server is listening on port ${PORT}...`);
	await connectToDatabase();
});
