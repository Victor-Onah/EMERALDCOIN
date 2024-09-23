import { BiX } from "react-icons/bi";
import { Suspense, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { BsPeopleFill } from "react-icons/bs";
import { AppCtx } from "./layout";
import { PiUserFill } from "react-icons/pi";
import { IoReload } from "react-icons/io5";

const ReferralsPage = () => {
	const [doShare, setDoShare] = useState(false);
	const [navbarHeight, setNavbarHeight] = useState(63);
	const { state, dispatch } = useContext(AppCtx);
	const { referralCode, totalReferrals, balance } = state.user;

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(
				`https://t.me/emeraldcoin_miner_bot?start=${referralCode}`
			);
			toast.success("Link copied successfully!");
		} catch {
			toast.error("Failed to copy link!");
		}
	};

	const shareLink = async () => {
		const toastId = toast.loading("Please wait");
		try {
			await navigator.share({
				text: `Join me in mining $Emerald.\nI've mined ${balance} $EMD already.`,
				title: "$Emerald Coin",
				url: `https://t.me/emeraldcoin_miner_bot?start=${referralCode}`
			});
		} catch {
			toast.error("Failed to share!");
		} finally {
			toast.dismiss(toastId);
		}
	};

	useEffect(() => {
		const navbar = document.getElementById("nav-bar");
		const updateNavbarHeight = () =>
			setNavbarHeight(navbar?.clientHeight || 63);

		updateNavbarHeight();
		window.addEventListener("resize", updateNavbarHeight);

		return () => window.removeEventListener("resize", updateNavbarHeight);
	}, []);

	const ShareActions = () => (
		<div
			className={`fixed bg-green-500 w-full transition-transform z-50 ${
				doShare ? "" : "translate-y-full"
			}`}
			style={{ bottom: navbarHeight }}>
			<div className="relative px-4 py-12 flex flex-col gap-4">
				<button
					onClick={copyLink}
					className="p-2 bg-white text-green-500 rounded-md active:scale-95 transition-transform">
					Copy link
				</button>
				<button
					onClick={shareLink}
					className="p-2 bg-white text-green-500 rounded-md active:scale-95 transition-transform">
					Share link
				</button>
				<button
					onClick={() => setDoShare(false)}
					className="absolute top-1 right-1 p-2 text-white bg-green-400 rounded-full text-lg">
					<BiX />
				</button>
			</div>
		</div>
	);

	return (
		<main className="flex flex-col gap-4 text-black z-[9999] relative flex-1 overflow-x-hidden pt-8">
			{totalReferrals > 0 ? (
				<div className="flex flex-col flex-1 w-full items-center justify-center gap-12">
					<div className="flex flex-col gap-3 justify-center items-center">
						<h1 className="text-xl text-center font-bold text-green-500 px-4">
							Invite more friends to earn more $Emerald
						</h1>
						<button
							onClick={() => setDoShare(true)}
							className="p-2 bg-green-500 text-white rounded-md active:scale-95 transition-transform">
							Invite more friends
						</button>
					</div>
					<div className="w-full p-4 z-50 rounded-t-3xl flex-1 bg-gradient-to-b from-green-600 to-green-900 flex flex-col gap-8 text-white">
						<h2 className="flex gap-4 items-center">
							<BsPeopleFill className="text-2xl w-fit" />
							<span className="w-[2px] h-8 bg-green-300 inline-block"></span>
							<span className="flex flex-1 gap-1 font-bold text-lg">
								{totalReferrals.toLocaleString()} Friend
								{totalReferrals > 1 && "s"}
							</span>
							<span>
								<button
									className="p-1 bg-green-400 text-xs rounded-md active:scale-95 transition-transform inline-flex items-center gap-1"
									onClick={() =>
										dispatch({ type: "set_friends" })
									}>
									<IoReload /> Refresh
								</button>
							</span>
						</h2>
						<Suspense fallback={<FriendsOptimisticUi />}>
							<FriendsList />
						</Suspense>
					</div>
					{doShare && (
						<div
							className="fixed inset-0 bg-black bg-opacity-20 z-50"
							onClick={() => setDoShare(false)}></div>
					)}
					<ShareActions />
				</div>
			) : (
				<div className="flex flex-col flex-1 w-full items-center justify-around p-4 gap-4">
					<div className="text-center text-green-500 space-y-3">
						<h1 className="text-xl font-bold">
							Invite friends to earn $Emerald
						</h1>
						<p>
							Earn 5,000 $EMD for every <br /> friend you refer
						</p>
					</div>
					<img
						src="/images/dwarf-friends.png"
						alt="$EMD Coin"
						className="h-[250px]"
					/>
					<button
						onClick={() => setDoShare(true)}
						className="p-2 bg-green-500 text-white rounded-md active:scale-95 transition-transform">
						Invite friends
					</button>
					{doShare && (
						<div
							className="fixed inset-0 bg-black bg-opacity-20"
							onClick={() => setDoShare(false)}></div>
					)}
					<ShareActions />
				</div>
			)}
		</main>
	);
};

const FriendsList = () => {
	const { state, dispatch } = useContext(AppCtx);
	const { friends } = state;
	const { referralCode } = state.user;

	useEffect(() => {
		const getFriends = async () => {
			if (!friends) {
				try {
					const response = await fetch(
						`/api/user/friends?code=${referralCode}`
					);
					const data = await response.json();
					dispatch({ type: "set_friends", payload: data });
				} catch (error) {
					console.error("Error fetching friends:", error);
				}
			}
		};

		getFriends();
	}, [friends, referralCode, dispatch]);

	if (!friends) {
		return <FriendsOptimisticUi />;
	}

	return (
		<div className="space-y-2">
			{friends.map(friend => (
				<div
					key={friend.telegramId}
					className="flex items-center gap-4 flex-1">
					<div className="p-2 text-lg rounded-full bg-gradient-to-br from-green-600 to-green-400 text-white">
						<PiUserFill />
					</div>
					<div className="flex-1">{friend.username}</div>
				</div>
			))}
		</div>
	);
};

const FriendsOptimisticUi = () => {
	return (
		<div className="space-y-2">
			{[...Array(5)].map((_, index) => (
				<div
					key={index}
					className="flex items-center gap-4 animate-pulse">
					<div className="p-2 text-lg rounded-full bg-gradient-to-br from-green-600 to-green-400 text-white h-10 w-10"></div>
					<div className="flex-1 h-6 rounded-md bg-green-400"></div>
				</div>
			))}
		</div>
	);
};

export default ReferralsPage;
