import { useContext, useEffect, useState, useCallback } from "react";
import { BiInfoCircle, BiStopwatch } from "react-icons/bi";
import emerald from "../../lib/emerald-image-base64-string";
import { GiMiner } from "react-icons/gi";
import { toast } from "sonner";
import { AppCtx } from "./layout";
import ReactConfetti from "react-confetti";
import treasureChest from "../../lib/emerald-chest-image-base64-string";

const Dashboard = () => {
	const { state, dispatch } = useContext(AppCtx);
	const { balance, isMining, firstTimer, telegramId } = state.user;
	const MINING_RATE_PER_HOUR = 36_000;
	const INITIAL_BALANCE = balance;
	const MINING_DEADLINE = new Date("Fri, 15 Nov 2024 11:00:00 GMT");
	const [showTutorial, setShowTutorial] = useState(true);
	const [remainingTime, setRemainingTime] = useState(
		MINING_DEADLINE - Date.now()
	);
	const updateRemainingTime = useCallback(() => {
		setRemainingTime(MINING_DEADLINE - Date.now());
	}, []);

	const startNewMiningSession = async () => {
		dispatch({
			type: "set_mining",
			payload: true
		});

		try {
			await fetch(`/api/user/${telegramId}/new-mining-session`, {
				method: "PUT"
			});

			toast.success("New mining session started successfully!");
			dispatch({
				type: "set_mining",
				payload: true
			});
		} catch (error) {
			toast.error("Failed to sync update with server.");
			dispatch({ type: "set_mining", payload: false });
			dispatch({ type: "set_balance", payload: INITIAL_BALANCE });
		}
	};

	useEffect(() => {
		const miningInterval = setInterval(updateRemainingTime, 1000);

		return () => clearInterval(miningInterval);
	}, [updateRemainingTime]);

	const updateBalance = useCallback(() => {
		if (isMining) {
			const id = crypto.randomUUID();
			const template = `<span id='${id}' class="absolute font-bold animate-float bottom-0 z-50">+${10} $EMD</span>`;
			const coinContainer = document.getElementById("coin-container");

			if (coinContainer) {
				coinContainer.insertAdjacentHTML("beforeend", template);
				setTimeout(() => {
					const addedPoint = document.getElementById(id);
					if (addedPoint) addedPoint.remove();
				}, 3000);
			}
		}
	}, [isMining]);

	useEffect(() => {
		const animationInterval = setInterval(updateBalance, 1000);

		return () => clearInterval(animationInterval);
	}, [updateBalance]);

	// Convert remaining time to days, hours, minutes, and seconds
	const timeParts = {
		days: Math.floor(remainingTime / (1000 * 60 * 60 * 24)),
		hours: Math.floor((remainingTime / (1000 * 60 * 60)) % 24),
		minutes: Math.floor((remainingTime / (1000 * 60)) % 60),
		seconds: Math.floor((remainingTime / 1000) % 60)
	};

	return (
		<>
			<main className="flex flex-col gap-4 z-[9999] relative flex-1">
				<section className="py-4 text-center">
					<span className="text-xl font-bold text-green-600">
						{balance} $EMD
					</span>
					<span className="flex items-center justify-center gap-1 font-semibold text-zinc-400">
						<GiMiner />
						{MINING_RATE_PER_HOUR.toLocaleString()} $EMD/Hr
					</span>
				</section>
				<section className="p-4 z-50 rounded-t-3xl flex-1 bg-gradient-to-b from-green-600 to-green-900 flex flex-col gap-8 justify-between text-white">
					<h2 className="flex gap-4 items-center">
						<BiStopwatch className="font-bold text-2xl w-fit" />
						<span className="w-[2px] h-8 bg-green-300 inline-block"></span>
						<div className="flex flex-1 gap-1 font-bold z-50">
							{["days", "hours", "minutes", "seconds"].map(
								(unit, index) => {
									return (
										<>
											<div
												key={unit}
												className="flex flex-col items-center justify-center">
												<div className="text-lg">
													{String(timeParts[unit])
														.toString()
														.padStart(2, "0")}
												</div>
												<div className="text-[8px] font-light capitalize">
													{unit}
												</div>
											</div>
											{index < 3 && (
												<span className="pt-[3px]">
													:
												</span>
											)}
										</>
									);
								}
							)}
						</div>
						<span>
							<button
								className="p-2 bg-green-400 text-lg rounded-full active:scale-95 transition-transform inline-block"
								onClick={() =>
									toast.info(
										`Mining ends on ${MINING_DEADLINE.toDateString()}`
									)
								}>
								<BiInfoCircle />
							</button>
						</span>
					</h2>
					<div
						id="coin-container"
						className="flex flex-col items-center gap-2 m-auto relative">
						<button
							onClick={startNewMiningSession}
							disabled={isMining}
							className={`${
								isMining &&
								"after:contain-content after:absolute after:inset-0 after:bg-green-300 after:-z-10 after:rounded-full after:blur-lg"
							} active:scale-95 transition-transform relative flex items-center disabled:transform-none`}>
							<div className="w-[150px] border-[10px] border-green-400 aspect-square rounded-full shadow-inner">
								<div className="border-s-4 rounded-full h-full w-full border-green-600 bg-gradient-to-br from-green-500 via-green-300 to-green-600 flex justify-center items-center">
									<img
										src={emerald}
										alt="$EMD Coin"
										className="w-[80px]"
									/>
								</div>
							</div>
						</button>
					</div>
				</section>
			</main>

			{firstTimer && showTutorial && (
				<>
					<div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur z-[9999]"></div>
					<div
						style={{
							width: "calc(100vw - 32px)"
						}}
						className={`${
							showTutorial ? "scale-100" : "scale-0"
						} fixed bg-green-600 rounded-lg overflow-hidden z-[9999] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 p-4 space-y-2 transition-transform text-white`}>
						<div className="flex flex-col items-center gap-2 m-auto relative">
							<button
								className={`after:contain-content after:absolute after:inset-0 after:bg-green-300 after:-z-10 after:rounded-full after:blur-lg active:scale-95 transition-transform relative flex items-center disabled:transform-none`}>
								<div className="w-[150px] border-[10px] border-green-400 aspect-square rounded-full shadow-inner">
									<div className="border-s-4 rounded-full h-full w-full border-green-600 bg-gradient-to-br from-green-500 via-green-300 to-green-600 flex justify-center items-center">
										<img
											src={emerald}
											alt="$EMD Coin"
											className="w-[80px]"
										/>
									</div>
								</div>
							</button>
						</div>
						<div className="text-center">
							Click on the $Emerald coin to start your first
							mining session
						</div>
						<button
							onClick={() => setShowTutorial(false)}
							className="block text-green-500 p-2 rounded-lg bg-white font-semibold w-full active:scale-95 transition-transform">
							GOT IT
						</button>
					</div>
				</>
			)}

			{firstTimer && isMining && (
				<>
					<div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur z-[9999]"></div>
					<div
						style={{
							width: "calc(100vw - 32px)"
						}}
						className={`${
							firstTimer && isMining ? "scale-100" : "scale-0"
						} fixed bg-green-600 rounded-lg overflow-hidden z-[9999] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 space-y-2 transition-transform text-white`}>
						<div>
							<img src={treasureChest} alt="Emerald chest" />
							<div className="space-y-3 p-2 text-center">
								<h4 className="text-xl mb-2 font-bold">
									CONGRATULATIONS
								</h4>
								<p>
									You successfully started your first mining
									session.
								</p>
								<button
									onClick={async () => {
										dispatch({
											type: "set_first_timer",
											payload: false
										});
									}}
									className="block text-green-500 p-2 rounded-lg bg-white font-semibold w-full active:scale-95 transition-transform">
									GOT IT
								</button>
							</div>
						</div>
					</div>
				</>
			)}

			{firstTimer && isMining && (
				<div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
					<ReactConfetti
						height={window.innerHeight}
						width={window.innerWidth}
					/>
				</div>
			)}
		</>
	);
};

export default Dashboard;
