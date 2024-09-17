import { BiX } from "react-icons/bi";
import emerald from "../../lib/emerald-image-base64-string";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BsPeopleFill } from "react-icons/bs";

const ReferralsPage = () => {
	const [doShare, setDoShare] = useState(false);
	const [navbarHeight, setNavbarHeight] = useState(63);
	const FRIENDS = [];

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText("");
			toast.success("Link copied successfully!");
		} catch {
			toast.error("Failed to copy link!");
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

	const shareActions = (
		<div
			className={`fixed bg-green-500 w-full transition-transform ${
				doShare ? "" : "translate-y-full"
			}`}
			style={{ bottom: navbarHeight }}>
			<div className="relative px-4 py-12 flex flex-col gap-4">
				<button
					onClick={copyLink}
					className="p-2 bg-white text-green-500 rounded-md active:scale-95 transition-transform">
					Copy link
				</button>
				<button className="p-2 bg-white text-green-500 rounded-md active:scale-95 transition-transform">
					Share on Telegram
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
			{FRIENDS.length === 0 ? (
				<div className="flex flex-col flex-1 w-full items-center justify-around p-4 gap-4">
					<h1 className="text-xl text-center font-bold text-green-500">
						Invite friends to get more $Emeralds
					</h1>
					<img src={emerald} width={150} alt="$EMD Coin" />
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
					{shareActions}
				</div>
			) : (
				<div className="flex flex-col flex-1 w-full items-center justify-center gap-12">
					<h1 className="text-xl text-center font-bold text-green-500 px-4">
						Invite more friends to get more $Emeralds
					</h1>
					<button
						onClick={() => setDoShare(true)}
						className="p-2 bg-green-500 text-white rounded-md active:scale-95 transition-transform">
						Invite more friends
					</button>
					{doShare && (
						<div
							className="fixed inset-0 bg-black bg-opacity-20"
							onClick={() => setDoShare(false)}></div>
					)}
					{shareActions}
					<div className="w-full p-4 rounded-t-3xl flex-1 bg-gradient-to-b from-green-600 to-green-900 flex flex-col gap-8 justify-between text-white">
						<h2 className="flex gap-4 items-center">
							<BsPeopleFill className="text-2xl w-fit" />
							<span className="w-[2px] h-8 bg-green-300 inline-block"></span>
							<span className="flex flex-1 gap-1 font-bold text-lg">
								10 Friends
							</span>
						</h2>
						<div className="space-y-2">
							{Array(9)
								.fill()
								.map((_, i) => (
									<div
										key={i}
										className="flex items-center gap-4">
										<div className="h-10 w-10 rounded-full bg-green-300"></div>
										<div className="flex-1">
											Lorem, ipsum dolor.
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			)}
		</main>
	);
};

export default ReferralsPage;
