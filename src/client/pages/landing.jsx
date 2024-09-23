import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import emerald from "../lib/emerald-image-base64-string";

const LandingPage = () => {
	const id =
		"1234567890" ||
		localStorage.getItem("id") ||
		new URLSearchParams(window.location.search).get("id") ||
		JSON.parse(
			new URLSearchParams(
				new URLSearchParams(
					decodeURIComponent(
						decodeURIComponent(window.location.hash.substring(1))
					)
				).get("tgWebAppData")
			).get("user")
		)["id"];

	if (id) localStorage.setItem("id", id);

	const LAUNCH_DATE = new Date("Fri, 15 Nov 2024 11:00:00 GMT");
	const HEADING_TEXT = " Take Part In An Exclusive Airdrop. ";
	const [remainingTime, setRemainingTime] = useState(
		LAUNCH_DATE - Date.now()
	);
	const [heading, setHeading] = useState("");
	const [typing, setTyping] = useState(false);
	const [doneTyping, setDoneTyping] = useState(false);

	useEffect(() => {
		// Countdown timer
		const countInterval = setInterval(() => {
			const timeLeft = LAUNCH_DATE - Date.now();
			setRemainingTime(timeLeft > 0 ? timeLeft : 0);
		}, 1000);

		// Typing effect for heading
		const startTyping = () => {
			let cursorPosition = 0;
			setTyping(true);

			const typingInterval = setInterval(() => {
				if (cursorPosition < HEADING_TEXT.length) {
					setHeading(
						prev => prev + HEADING_TEXT.charAt(cursorPosition)
					);
					cursorPosition++;
				} else {
					clearInterval(typingInterval);
					setTyping(false);
					setDoneTyping(true);
				}
			}, 100);
		};

		// Delay before starting typing
		const typingDelay = setTimeout(startTyping, 3000);

		// Cleanup
		return () => {
			clearInterval(countInterval);
			clearTimeout(typingDelay);
		};
	}, []);

	// Convert remaining time to days, hours, minutes, and seconds
	const timeParts = {
		days: Math.floor(remainingTime / (1000 * 60 * 60 * 24)),
		hours: Math.floor((remainingTime / (1000 * 60 * 60)) % 24),
		minutes: Math.floor((remainingTime / (1000 * 60)) % 60),
		seconds: Math.floor((remainingTime / 1000) % 60)
	};

	return (
		<main>
			<div className="flex flex-col items-center h-screen justify-center gap-6 bg-green-600 p-4 text-white relative overflow-hidden">
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[540px] opacity-30 z-0">
					<img
						src={emerald}
						className="rounded-full block m-auto"
						alt="Emerald logo"
					/>
				</div>
				<h1 className="uppercase text-lg font-medium text-center z-50">
					<span>{heading.trim()}</span>
					<span
						className={`h-4 w-4 rounded-full ml-1 bg-white inline-block animate-pulse ${
							!typing && "[animation-duration:_0.6s]"
						}`}></span>
				</h1>
				<div
					className={`flex justify-center gap-1 font-bold z-50 transition-opacity duration-500 ${
						doneTyping ? "opacity-100" : "opacity-0"
					}`}>
					{["days", "hours", "minutes", "seconds"].map((unit, i) => (
						<>
							<div
								key={unit}
								className="flex flex-col justify-center">
								<div className="text-2xl">
									{String(timeParts[unit]).padStart(2, "0")}
								</div>
								<div className="text-[8px] font-light capitalize">
									{unit}
								</div>
							</div>
							{i < 3 && <span className="pt-[5px]">:</span>}
						</>
					))}
				</div>
				<Link
					className={`text-sm text-green-500 p-2 rounded-lg bg-white font-semibold z-50 transition-all ${
						doneTyping
							? "translate-y-0 opacity-100"
							: "translate-y-full opacity-0"
					}`}
					to={`/dashboard?id=${id}`}>
					GET STARTED
				</Link>
			</div>
		</main>
	);
};

export default LandingPage;
