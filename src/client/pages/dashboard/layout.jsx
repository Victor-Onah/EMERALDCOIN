import { createContext, useEffect, useReducer, useState } from "react";
import { BiHome } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { GrTasks } from "react-icons/gr";
import { MdLeaderboard } from "react-icons/md";
import emerald from "../../lib/emerald-image-base64-string";
import { Link, Outlet, useLocation } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

const reducer = (state, action) => {
	switch (action.type) {
		case "set_state":
			return { ...state, ...action.payload };
		case "set_balance":
			return { ...state, balance: state.balance + action.payload };
		case "set_mining":
			return { ...state, isMining: action.payload };
		case "set_chat_id":
			return { ...state, chatId: action.payload };
		default:
			return state;
	}
};

const defaultState = {
	// name: {
	// 	firstName: "Chukwuka",
	// 	lastName: "Onah"
	// },
	// username: "onahvictor74",
	// chatId: "5573365715",
	// tasksCompleted: [],
	// referrals: [],
	// miningTimelines: [
	// 	{
	// 		startTime: 1726495220052,
	// 		endTime: 1726516820052
	// 	},
	// 	{
	// 		startTime: 1726529335969,
	// 		endTime: 1726550935969
	// 	},
	// 	{
	// 		startTime: 1726553146254,
	// 		endTime: 1726574746254
	// 	},
	// 	{
	// 		startTime: 1726578212779,
	// 		endTime: 1726599812779
	// 	}
	// ],
	// balance: 0.0,
	// isMining: false,
	// firstTimer: false
};

export const AppCtx = createContext(null);

const DashboardLayout = () => {
	const { pathname } = useLocation();
	const [state, dispatch] = useReducer(reducer, defaultState);
	const [appLoadState, setAppLoadState] = useState("loading");

	const fetchUserData = async () => {
		setAppLoadState("loading");
		const { Telegram } = window;

		if (Telegram && Telegram.WebApp) {
			try {
				const chatId = new URLSearchParams(window.location.search).get(
					"chatId"
				);

				dispatch({ type: "set_chat_id", payload: chatId });

				const response = await fetch(`/api/user/${chatId}`);
				if (!response.ok) throw new Error("Failed to fetch user data");

				const userData = await response.json();
				dispatch({ type: "set_state", payload: userData });
				setAppLoadState("done");
			} catch (error) {
				console.error("Error fetching user data:", error);
				setAppLoadState("failed");
			}
		} else {
			setAppLoadState("failed");
		}
	};

	useEffect(() => {
		fetchUserData();
	}, []);

	const navLinks = [
		{ to: "/dashboard", label: "Home", icon: <BiHome />, key: "home" },
		{
			to: "/dashboard/tasks",
			label: "Tasks",
			icon: <GrTasks />,
			key: "tasks"
		},
		{
			to: "/dashboard/friends",
			label: "Friends",
			icon: <BsPeople />,
			key: "friends"
		},
		{
			to: "/dashboard/leader-board",
			label: "Leader Board",
			icon: <MdLeaderboard />,
			key: "leaderboard"
		}
	];

	return (
		<>
			{appLoadState !== "done" && (
				<main>
					<div className="flex flex-col items-center h-screen justify-center gap-1 bg-green-600 p-4 text-white relative overflow-hidden">
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[540px] opacity-30 z-0">
							<img
								src={emerald}
								className="rounded-full block m-auto"
								alt="Emerald logo"
							/>
						</div>
						{appLoadState === "loading" && (
							<>
								<CgSpinner className="animate-spin text-6xl" />
								<span className="text-center text-xl">
									Loading...
								</span>
							</>
						)}
						{appLoadState === "failed" && (
							<div className="text-center flex justify-center items-center flex-col gap-3 z-50">
								<h1 className="text-2xl font-bold">Oops!</h1>
								<p className="text-lg">
									Sorry we couldn't load the app.
								</p>
								<p className="text-lg">
									Make sure you're connected to the internet
									and you're running the application within
									Telegram.
								</p>
								<button
									className="text-sm text-green-500 p-2 rounded-lg bg-white font-semibold"
									onClick={fetchUserData}>
									Refresh
								</button>
							</div>
						)}
					</div>
				</main>
			)}
			{appLoadState === "done" && (
				<div className="flex h-screen flex-col bg-slate-50">
					<header id="header" className="text-sm px-4 py-4 w-full">
						<div className="flex flex-col gap-4 text-white">
							<Link
								to="/dashboard"
								className="flex items-center gap-1 text-green-500">
								<img
									src={emerald}
									width={30}
									alt="Emerald logo"
								/>
								$Emerald
							</Link>
						</div>
					</header>

					<div
						style={{
							zIndex:
								(state.firstTimer && state.isMining) ||
								state.firstTimer
									? 50
									: 0
						}}
						className="flex-1 flex max-h-full overflow-x-hidden">
						<AppCtx.Provider value={{ state, dispatch }}>
							<Outlet />
						</AppCtx.Provider>
					</div>

					<footer
						style={{
							zIndex:
								(state.firstTimer && state.isMining) ||
								state.firstTimer
									? 0
									: 50
						}}
						id="nav-bar"
						aria-roledescription="Navigation footer"
						role="navigation"
						className="flex justify-between p-2 bg-green-700 text-white text-center border-t border-green-500 items-center sticky bottom-0">
						{navLinks.map(({ to, label, icon, key }) => (
							<Link
								to={to}
								key={key}
								className={`${
									pathname === to
										? "text-green-100 font-black bg-green-600 rounded-lg"
										: ""
								} flex-1 flex flex-col items-center p-2 active:scale-90 transition-transform`}>
								<span>{icon}</span>
								<span className="text-xs">{label}</span>
							</Link>
						))}
					</footer>
				</div>
			)}
		</>
	);
};

export default DashboardLayout;
