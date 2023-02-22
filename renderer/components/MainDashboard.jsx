import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFolder2Open, BsFolderCheck, BsListUl } from "react-icons/bs";
import { FiUploadCloud } from "react-icons/fi";
import { BiSelectMultiple } from "react-icons/bi";
import useSWR from "swr";

const MainDashboard = () => {
	const [dashboardData, setDashboardData] = useState("");

	const fetcher = async (url) => {
		try {
			let tok = localStorage.getItem("token");
			const { data } = await axios.get(url + tok);
			setDashboardData(data);
			return data;
		} catch (error) {
			return error;
		}
	};

	let api = `${process.env.DOMAIN_NAME}/api/get-dashboard-details/`;
	const { data, error } = useSWR(api, fetcher);
	console.log(dashboardData);
	return (
		<div className="p-14">
			<h1 className="text-2xl text-gray-900 font-bold">Dashboard</h1>
			<div className="my-5 flex items-center gap-10">
				<div className="p-5 bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center gap-6 h-60 w-60">
					<BsFolder2Open className="text-4xl text-gray-600" />
					<h1 className="text-2xl text-gray-800  font-semibold">Projects</h1>
					<h1 className="text-2xl text-gray-800  font-bold">
						{dashboardData.projectsCount}
					</h1>
				</div>
				<div className="p-5 bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center gap-6 h-60 w-60">
					<BsListUl className="text-4xl text-gray-600" />
					<h1 className="text-2xl text-gray-800  font-semibold">Events</h1>
					<h1 className="text-2xl text-gray-800  font-bold">
						{dashboardData.eventsCount}
					</h1>
				</div>
				<div className="p-5 bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center gap-6 h-60 w-60">
					<FiUploadCloud className="text-4xl text-gray-600" />
					<h1 className="text-2xl text-gray-800  font-semibold">
						Uploaded Images
					</h1>
					<h1 className="text-2xl text-gray-800  font-bold">
						{dashboardData.uploadedImagesCount}
					</h1>
				</div>
				<div className="p-5 bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center gap-6 h-60 w-60">
					<BiSelectMultiple className="text-4xl text-gray-600" />
					<h1 className="text-2xl text-gray-800  font-semibold">
						Selected Images
					</h1>
					<h1 className="text-2xl text-gray-800  font-bold">
						{dashboardData.selectedImagesCount}
					</h1>
				</div>
			</div>
			<div className="my-5 flex items-center gap-10">
				<div className="p-5 bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center gap-6 h-60 w-60">
					<BsFolder2Open className="text-4xl text-gray-600" />
					<h1 className="text-2xl text-gray-800  font-semibold">Ongoing Projects</h1>
					<h1 className="text-2xl text-gray-800  font-bold">
						{dashboardData.ongoingProjectsCount}
					</h1>
				</div>
				<div className="p-5 bg-white rounded-2xl shadow-2xl flex flex-col justify-center items-center gap-6 h-60 w-60">
					<BsFolderCheck className="text-4xl text-gray-600" />
					<h1 className="text-2xl text-gray-800  font-semibold text-center">Completed Projects</h1>
					<h1 className="text-2xl text-gray-800  font-bold">
						{dashboardData.completedProjectsCount}
					</h1>
				</div>


			</div>
		</div>
	);
};

export default MainDashboard;
