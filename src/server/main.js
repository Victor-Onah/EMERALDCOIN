import express from "express";
import ViteExpress from "vite-express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserController from "./controllers/user-controller.js";
import MiningController from "./controllers/mining-controller.js";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000");
const DB_URL = process.env.DB_URL;

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
app.put("/api/user/:id/new-mining-session", MiningController.handleNewSession);

app.get("/api/user/friends", UserController.getFriends);

app.get("/api/user/:id", UserController.getUser);

// Ping endpoint to keep server active
app.get("/ping", (req, res) => res.sendStatus(200));

// Telegram webhook
app.post("/telegram-webhook", UserController.handleCommand);

// Start the server
ViteExpress.listen(app, PORT, async () => {
	console.log(`Server is listening on port ${PORT}...`);
	await connectToDatabase();
});
