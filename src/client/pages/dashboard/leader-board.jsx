import {
	GiMiner,
	GiPodiumSecond,
	GiPodiumThird,
	GiPodiumWinner
} from "react-icons/gi";

const LeaderBoardPage = () => {
	return (
		<main className="flex flex-col gap-4 text-black z-[9999] relative flex-1 overflow-x-hidden pt-2">
			<div className="flex flex-col flex-1 w-full items-center justify-around p-4 gap-4">
				<h1 className="text-xl text-center font-bold text-green-500">
					Top Earners
				</h1>
				<div className="flex gap-4 items-end justify-center w-full">
					<div className="w-[25%] text-center">
						<div className="aspect-square rounded-full bg-slate-200 w-full relative">
							<span className="bg-yellow-800 p-2 flex justify-center items-center text-white w-fit rounded-full absolute bottom-0 -right-1">
								<GiPodiumThird />
							</span>
						</div>
						<div className="overflow-clip text-ellipsis">
							onahvictor74@gmail.com
						</div>
					</div>
					<div className="w-[35%] text-center">
						<div className="aspect-square rounded-full bg-slate-200 w-full relative">
							<span className="bg-yellow-600 p-2 flex justify-center items-center text-white w-fit rounded-full absolute bottom-0 -right-1">
								<GiPodiumWinner />
							</span>
						</div>
						<div className="overflow-clip text-ellipsis">
							onahvictor74@gmail.com
						</div>
					</div>
					<div className="w-[30%] text-center">
						<div className="aspect-square rounded-full bg-slate-200 w-full relative">
							<span className="bg-zinc-600 p-2 flex justify-center items-center text-white w-fit rounded-full absolute bottom-0 -right-1">
								<GiPodiumSecond />
							</span>
						</div>
						<div className="overflow-clip text-ellipsis">
							onahvictor74@gmail.com
						</div>
					</div>
				</div>
				<br />
				<div className="w-full space-y-4">
					<h3 className="text-green-500 text-center text-lg font-semibold">
						Your position
					</h3>
					<div className="flex items-center gap-4 w-full p-2 rounded-lg bg-green-100">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">onahvictor74</div>
						<div className="flex-1 text-right">#123,456</div>
					</div>
				</div>
			</div>
			<div className="w-full p-4 rounded-t-3xl flex-1 bg-gradient-to-b from-green-600 to-green-900 flex flex-col gap-8 justify-between text-white">
				<h2 className="flex gap-4 items-center">
					<GiMiner className="text-2xl w-fit" />
					<span className="w-[2px] h-8 bg-green-300 inline-block"></span>
					<span className="flex flex-1 gap-1 font-bold z-50 text-lg">
						15k Miners
					</span>
				</h2>
				<div className="space-y-2">
					<div className="flex items-center gap-4">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">Lorem, ipsum dolor.</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">Lorem, ipsum dolor.</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">Lorem, ipsum dolor.</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">Lorem, ipsum dolor.</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">Lorem, ipsum dolor.</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">Lorem, ipsum dolor.</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">Lorem, ipsum dolor.</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">Lorem, ipsum dolor.</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="h-10 w-10 rounded-full bg-green-300"></div>
						<div className="flex-1">Lorem, ipsum dolor.</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default LeaderBoardPage;
