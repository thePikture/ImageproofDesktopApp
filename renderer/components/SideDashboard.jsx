import Image from "next/image";
import React, { useEffect } from "react";
import logo from "../public/images/imgproof.png";
import electron from 'electron'

import { CgProfile } from "react-icons/cg";
import { MdUpdate } from "react-icons/md";
import { FiLogOut, FiHome } from "react-icons/fi";
import { BsFolderCheck, BsFolder2Open } from "react-icons/bs";
import { useRouter } from "next/router"

const SideDashboard = ({ selectedPath }) => {

	const router = useRouter()
	const handleRoute = (route, params) => {
		console.log(route, params)
		if (params) {
			localStorage.setItem("status", params)
			router.push({ pathname: `/${route}`, query: { "status": params } });
		} else {

			router.push(`/${route}`)
		}
	}
	let shell = electron.shell
	console.log({ selectedPath })

	const handleLogout = () => {
		localStorage.removeItem("token")
		localStorage.removeItem("checked")
		localStorage.removeItem("projectId")
		localStorage.removeItem("eventId")
		router.push("/login")


	}
	return (
		<div className="p-6 h-screen bg-white z-20 lg:w-60">
			<div className="flex flex-col justify-start items-center">
				<Image
					src={logo}
					alt="logo"
					width="150"
					height="40"
					objectFit="contain"
				/>
				<div className="mt-20 mb-4 border-b border-gray-100 pb-4">
					{selectedPath == "dashboard" ? <div
						className="flex mb-2 justify-start items-center gap-4 px-5 bg-gray-900 p-2 rounded-md cursor-pointer shadow-lg m-auto"
						onClick={() => handleRoute("dashboard")}
					>
						<FiHome className="text-2xl text-white" />
						<h2 className="text-base text-white font-semibold">
							Dashboard
						</h2>
					</div> :
						<div
							className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-400 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto"
							onClick={() => handleRoute("dashboard")}
						>
							<FiHome className="text-2xl text-gray-600 group-hover:text-white" />
							<h2 className="text-base text-gray-800 group-hover:text-white font-semibold">
								Dashboard
							</h2>
						</div>
					}

					{selectedPath == "ongoing" ?
						<div
							className="flex mb-2 justify-start items-center gap-4 px-5 bg-gray-900 p-2 rounded-md group cursor-pointer shadow-lg m-auto"
							onClick={() => handleRoute("createProject", "ongoing")}
						>
							<BsFolder2Open className="text-2xl text-white" />
							<h2 className="text-base text-white font-semibold">
								Ongoing
							</h2>
						</div>
						: <div
							className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-400 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto"
							onClick={() => handleRoute("createProject", "ongoing")}
						>
							<BsFolder2Open className="text-2xl text-gray-600 group-hover:text-white" />
							<h2 className="text-base text-gray-800 group-hover:text-white font-semibold">
								Ongoing
							</h2>
						</div>}
					{selectedPath == "completed" ?
						<div
							className="flex mb-2 justify-start items-center gap-4 px-5 bg-gray-900 p-2 rounded-md group cursor-pointer shadow-lg m-auto"
							onClick={() => handleRoute("createProject", "completed")}
						>
							<BsFolderCheck className="text-2xl text-white" />
							<h2 className="text-base text-white font-semibold">
								Completed
							</h2>
						</div>
						: <div
							className="flex mb-2 justify-start items-center gap-4 px-5 hover:bg-gray-400 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto"
							onClick={() => handleRoute("createProject", "completed")}
						>
							<BsFolderCheck className="text-2xl text-gray-600 group-hover:text-white" />
							<h2 className="text-base text-gray-800 group-hover:text-white font-semibold">
								Completed
							</h2>
						</div>}
				</div>
				<div className="my-4 border-b border-gray-100 pb-4">
					{selectedPath == "profile" ?
						<div className="flex mb-2 justify-start items-center gap-4 pl-2 pr-5 bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto" onClick={() => handleRoute("profile")}>
							<CgProfile className="text-2xl text-white" />
							<h2 className="text-base text-white font-semibold">
								Profile
							</h2>
						</div>
						: <div className="flex mb-2 justify-start items-center gap-4 pl-2 pr-5 hover:bg-gray-400 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto" onClick={() => handleRoute("profile")}>
							<CgProfile className="text-2xl text-gray-600 group-hover:text-white" />
							<h2 className="text-base text-gray-800 group-hover:text-white font-semibold">
								Profile
							</h2>
						</div>}
					<div className="flex mb-2 justify-start items-center gap-4 pl-2 pr-5 hover:bg-gray-400 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto" onClick={() => shell.openExternal("https://imageproof.ai/pricing/")}>
						<MdUpdate className="text-2xl text-gray-600 group-hover:text-white" />
						<h2 className="text-base text-gray-800 group-hover:text-white font-semibold">
							Upgrade
						</h2>
					</div>
				</div>
				<div className="my-4 border-gray-100 pb-4">
					<div className="flex mb-2 justify-start items-center gap-4 pl-2 pr-5 hover:bg-red-600 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto" onClick={handleLogout}>
						<FiLogOut className="text-2xl text-gray-600 group-hover:text-white" />
						<h2 className="text-base text-gray-800 group-hover:text-white font-semibold">
							Logout
						</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideDashboard;
