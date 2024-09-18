import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing";
import DashboardLayout from "./pages/dashboard/layout";
import Dashboard from "./pages/dashboard";
import ReferralsPage from "./pages/dashboard/referrals";
import { Toaster } from "sonner";
import LeaderBoardPage from "./pages/dashboard/leader-board";
import { useEffect } from "react";
import "./App.css";

const App = () => {
	useEffect(() => {
		const { Telegram } = window;

		if (Telegram && Telegram.WebApp) {
			Telegram.WebApp.ready();
			Telegram.WebApp.expand();
		}
	}, []);

	return (
		<BrowserRouter>
			<Toaster duration={3000} richColors position="top-center" />
			<Routes>
				<Route index element={<LandingPage />} />
				<Route path="/dashboard" element={<DashboardLayout />}>
					<Route index element={<Dashboard />} />
					<Route
						path="/dashboard/friends"
						element={<ReferralsPage />}
					/>
					<Route
						path="/dashboard/leader-board"
						element={<LeaderBoardPage />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
