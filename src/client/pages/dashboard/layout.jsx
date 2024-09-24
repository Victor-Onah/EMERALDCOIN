import { createContext, useEffect, useReducer, useState } from "react";
import { BiHome } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { GrTasks } from "react-icons/gr";
import emerald from "../../lib/emerald-image-base64-string";
import { Link, Outlet, useLocation } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { RiProfileFill } from "react-icons/ri";

const reducer = (state, action) => {
	switch (action.type) {
		case "set_state":
			return { ...state, user: action.payload };
		case "set_balance":
			return {
				...state,
				user: {
					...state.user,
					balance: state.user.balance + action.payload
				}
			};
		case "set_mining":
			return {
				...state,
				user: { ...state.user, isMining: action.payload }
			};
		case "set_first_timer":
			return {
				...state,
				user: { ...state.user, firstTimer: action.payload }
			};
		case "set_chat_id":
			return { ...state, id: action.payload };
		case "set_friends":
			return { ...state, friends: action.payload };
		default:
			return state;
	}
};

const defaultState = {
	user: {
		// _id: "66ef0f5bf15791f959fab9a3",
		// telegramId: "1234567890",
		// referredBy: "5GGaPLGdGf",
		// balance: 0,
		// totalReferrals: 1,
		// dateJoined: "2024-09-21T18:22:43.768Z",
		// referralCode: "bycDgiRiMW"
		// __v: 0
	}
};

export const AppCtx = createContext(null);

const DashboardLayout = () => {
	const { pathname } = useLocation();
	const [state, dispatch] = useReducer(reducer, defaultState);
	const [appLoadState, setAppLoadState] = useState("loading");

	useEffect(() => {
		let miningInterval;

		if (state.user && state.user.isMining) {
			miningInterval = setInterval(() => {
				dispatch({
					type: "set_balance",
					payload: 10
				});
			}, 1000);
		}

		return () => clearInterval(miningInterval);
	}, [state.user.isMining]);

	const fetchUserData = async () => {
		setAppLoadState("loading");
		const { Telegram } = window;

		if (Telegram && Telegram.WebApp) {
			try {
				const id =
					new URLSearchParams(window.location.search).get("id") ||
					localStorage.getItem("id") ||
					JSON.parse(
						new URLSearchParams(
							new URLSearchParams(
								decodeURIComponent(
									decodeURIComponent(
										window.location.hash.substring(1)
									)
								)
							).get("tgWebAppData")
						).get("user")
					)["id"];

				if (id) localStorage.setItem("id", id);

				dispatch({ type: "set_chat_id", payload: id });

				const response = await fetch(`/api/user/${id}`);

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
			to: "/dashboard/profile",
			label: "Profile",
			icon: <RiProfileFill />,
			key: "profile"
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
