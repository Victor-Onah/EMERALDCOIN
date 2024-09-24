import MiningProgress from "../models/mining-progress.js";

export default class MiningController {
	// Handler for starting new mining session
	static async handleNewSession(req, res) {
		const { id } = req.params;

		await MiningController.startNewMiningSession(id);

		res.sendStatus(200);
	}

	// start new mining session
	static async startNewMiningSession(id) {
		const isMining = await MiningController.isMining(id);
		const fourHoursTime = new Date(Date.now() + 60_000 * 60 * 4);

		if (isMining) return false;

		return (
			await MiningProgress.create({
				userId: id,
				startTime: Date.now(),
				endTime: fourHoursTime,
				status: "in-progress"
			}),
			true
		);
	}

	// checks if a user is still a new comer
	static async isNewUser(id) {
		const session = await MiningProgress.exists({ userId: id });

		return session ? false : true;
	}

	// checks if the user has an active mining session
	static async isMining(id) {
		const sessions = await MiningProgress.find({
			userId: id
		});
		let openSession = false;

		// close past sessions
		for (let session of sessions) {
			if (Date.now() > session.endTime) {
				session.status = "completed";

				await session.save();
			} else {
				openSession = true;
			}
		}

		return openSession;
	}
}
