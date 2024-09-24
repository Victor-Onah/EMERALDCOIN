import { useContext, useState } from "react";
import { AppCtx } from "./layout";
import { toast } from "sonner";

const ProfilePage = () => {
	const { state } = useContext(AppCtx);
	const {
		telegramId,
		username,
		balance,
		referralCode,
		tonWallet,
		totalReferrals,
		dateJoined
	} = state.user;
	const [allowEditWallet, setAllowEditWallet] = useState(false);

	return (
		<main className="flex flex-col gap-4 z-[9999] relative flex-1 overflow-x-hidden p-4">
			<h1 className="font-black text-2xl text-green-600">Profile</h1>
			<div className="space-y-3">
				<div className="space-y-3">
					<h2 className="text-lg font-bold text-green-500">
						Personal Information
					</h2>
					<div className="space-y-2">
						<div>
							<h3 className="text-zinc-600">
								<b>Username</b>
							</h3>
							<p>{username || "No username"}</p>
						</div>
						<div>
							<h3 className="text-zinc-600">
								<b>Telegram ID</b>
							</h3>
							<p>{telegramId}</p>
						</div>
						<div>
							<h3 className="text-zinc-600">
								<b>Referral link</b>
							</h3>
							<p
								onClick={async () => {
									try {
										await navigator.clipboard.writeText(
											`https://t.me/emeraldcoin_miner_bot?start=${referralCode}`
										);
										toast.success(
											"Link copied successfully!"
										);
									} catch {
										toast.error("Failed to copy link!");
									}
								}}
								className="underline">
								https://t.me/emeraldcoin_miner_bot?start=
								{referralCode}
							</p>
						</div>
					</div>
				</div>
				<hr />
				<div className="space-y-3">
					<h2 className="text-lg font-bold text-green-500">
						Wallet Information
					</h2>
					<div className="space-y-2">
						<div>
							<h3 className="text-zinc-600">
								<b>Wallet address</b>
							</h3>
							<p contentEditable={allowEditWallet}>
								{tonWallet || "Not set"}
							</p>
							<div className="flex justify-end gap-4">
								{allowEditWallet && (
									<button
										onClick={() =>
											setAllowEditWallet(false)
										}>
										Cancel
									</button>
								)}
								<button
									onClick={() =>
										setAllowEditWallet(!allowEditWallet)
									}>
									{tonWallet
										? allowEditWallet
											? "Save"
											: "Edit"
										: "Add"}
								</button>
							</div>
						</div>
						<div>
							<h3 className="text-zinc-600">
								<b>$Emerald balance</b>
							</h3>
							<p>{balance.toLocaleString()}$EMD</p>
						</div>
					</div>
				</div>
				<hr />
				<div className="space-y-3">
					<h2 className="text-lg font-bold text-green-500">
						Referral statistics
					</h2>
					<div className="space-y-2">
						<div>
							<h3 className="text-zinc-600">
								<b>Total referrals</b>
							</h3>
							<p>{totalReferrals}</p>
						</div>
						<div>
							<h3 className="text-zinc-600">
								<b>Date joined</b>
							</h3>
							<p>{new Date(dateJoined).toDateString()}</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ProfilePage;
