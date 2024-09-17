import { useContext, useEffect, useState, useCallback } from "react";
import { BiInfoCircle, BiStopwatch } from "react-icons/bi";
import emerald from "../../lib/emerald-image-base64-string";
import { GiMiner } from "react-icons/gi";
import { toast } from "sonner";
import { AppCtx } from "./layout";

const Dashboard = () => {
	const {
		state: { balance, isMining },
		dispatch
	} = useContext(AppCtx);

	const MINING_RATE_PER_HOUR = 100_000;
	const MINING_DEADLINE = new Date("Fri, 15 Nov 2024 11:00:00 GMT");

	const [remainingTime, setRemainingTime] = useState(
		MINING_DEADLINE - Date.now()
	);

	const updateRemainingTime = () => {
		setRemainingTime(MINING_DEADLINE - Date.now());
	};

	useEffect(() => {
		const miningInterval = setInterval(updateRemainingTime, 1000);

		return () => clearInterval(miningInterval);
	}, []);

	const updateBalance = () => {
		if (isMining) {
			const id = crypto.randomUUID();
			const template = `<span id='${id}' class="absolute font-bold animate-float bottom-0 z-50">+${(
				MINING_RATE_PER_HOUR / 3_600
			).toFixed(2)} $EMD</span>`;
			const coinContainer = document.getElementById("coin-container");

			if (coinContainer) {
				coinContainer.insertAdjacentHTML("beforeend", template);
				setTimeout(() => {
					const addedPoint = document.getElementById(id);
					if (addedPoint) addedPoint.remove();
				}, 3000);
			}

			dispatch({
				type: "set_balance",
				payload: MINING_RATE_PER_HOUR / 3_600
			});
		}
	};

	useEffect(() => {
		const pointAdditionAnimationInterval = setInterval(updateBalance, 1000);

		return () => clearInterval(pointAdditionAnimationInterval);
	}, [isMining]);

	// Convert remaining time to days, hours, minutes, and seconds
	const timeParts = {
		days: Math.floor(remainingTime / (1000 * 60 * 60 * 24)),
		hours: Math.floor((remainingTime / (1000 * 60 * 60)) % 24),
		minutes: Math.floor((remainingTime / (1000 * 60)) % 60),
		seconds: Math.floor((remainingTime / 1000) % 60)
	};

	return (
		<main className="flex flex-col gap-4 text-black z-[9999] relative flex-1">
			<section className="py-4 text-center text-green-500">
				<span className="text-xl font-bold">
					{Number(balance.toFixed(2)).toLocaleString()} $EMD
				</span>
				<span className="flex items-center justify-center gap-1 font-semibold">
					<GiMiner />
					{MINING_RATE_PER_HOUR.toLocaleString()} $EMD/Hr
				</span>
			</section>
			<section className="p-4 z-50 rounded-t-3xl flex-1 bg-gradient-to-b from-green-600 to-green-900 flex flex-col gap-8 justify-between text-white">
				<h2 className="flex gap-4 items-center">
					<BiStopwatch className="animate-ring font-bold text-2xl w-fit" />
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
											<span className="pt-[3px]">:</span>
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
					className="flex flex-col items-center gap-2 max-w-[240px] m-auto relative">
					<button
						onClick={() =>
							dispatch({ type: "set_mining", payload: true })
						}
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
	);
};

export default Dashboard;
