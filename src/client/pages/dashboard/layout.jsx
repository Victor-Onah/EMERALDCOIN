import { createContext, useEffect, useReducer, useState } from "react";
import { BiHome } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { GrTasks } from "react-icons/gr";
import { MdLeaderboard } from "react-icons/md";
import emerald from "../../lib/emerald-image-base64-string";
import { Link, Outlet, useLocation } from "react-router-dom";

const reducer = (state, action) => {
	switch (action.type) {
		case "set_state":
			return { ...state, ...action.payload };
		case "set_balance":
			return { ...state, balance: state.balance + action.payload };
		case "set_mining":
			return { ...state, isMining: action.payload };
		default:
			return state;
	}
};

const defaultState = {
	name: {
		firstName: "Chukwuka",
		lastName: "Onah"
	},
	username: "onahvictor74",
	chatId: "5573365715",
	tasksCompleted: [],
	referrals: [],
	miningTimelines: [
		{
			startTime: 1726495220052,
			endTime: 1726516820052
		},
		{
			startTime: 1726529335969,
			endTime: 1726550935969
		},
		{
			startTime: 1726553146254,
			endTime: 1726574746254
		},
		{
			startTime: 1726578212779,
			endTime: 1726599812779
		}
	],
	balance: 1.23232355667774,
	isMining: false
};
export const AppCtx = createContext(null);

const DashboardLayout = () => {
	const { pathname } = useLocation();
	const [state, dispatch] = useReducer(reducer, defaultState);
	const [appLoadState, setAppLoadState] = useState("done");

	// useEffect(() => {
	// 	const fetchUserData = async () => {
	// 		setAppLoadState("loading");
	// 		const { Telegram } = window;

	// 		if (Telegram && Telegram.WebApp) {
	// 			try {
	// 				const chatId = new URLSearchParams(
	// 					window.location.search
	// 				).get("chatId");
	// 				const response = await fetch(`/api/user/${chatId}`);
	// 				if (!response.ok)
	// 					throw new Error("Failed to fetch user data");

	// 				const userData = await response.json();
	// 				dispatch({ type: "set_state", payload: userData });
	// 				setAppLoadState("done");
	// 			} catch (error) {
	// 				console.error("Error fetching user data:", error);
	// 				setAppLoadState("failed");
	// 			}
	// 		} else {
	// 			setAppLoadState("failed");
	// 		}
	// 	};

	// 	fetchUserData();
	// }, []);

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
			{appLoadState === "loading" && <h1>Loading...</h1>}
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
						onScroll={e => {
							console.log(e);
						}}
						className="flex-1 flex max-h-full overflow-x-hidden z-0">
						<AppCtx.Provider value={{ state, dispatch }}>
							<Outlet />
						</AppCtx.Provider>
					</div>

					<footer
						id="nav-bar"
						aria-roledescription="Navigation footer"
						role="navigation"
						className="flex justify-between p-2 bg-green-700 text-white text-center border-t border-green-500 items-center z-50 sticky bottom-0">
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
			{appLoadState === "failed" && <h1>Failed to load app</h1>}
		</>
	);
};

export default DashboardLayout;
