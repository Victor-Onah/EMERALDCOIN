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
		// Get user's previous sessions
		const sessions = await MiningProgress.find({ userId: id });
		const fourHoursTime = Date.now() + 60_000 * 60 * 4;
		let openSession;

		// close past sessions
		for (let session of sessions) {
			if (Date.now() > session.endTime) {
				session.status = "completed";

				await session.save();
			} else {
				openSession = false;
			}
		}

		if (openSession === false) return openSession;
		else
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
		const session = await MiningProgress.exists({
			userId: id,
			status: "in-progress"
		});

		return session ? true : false;
	}
}
