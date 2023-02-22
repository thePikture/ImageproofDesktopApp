import { useRouter } from "next/router";
import React, { useState } from "react";
import CreateEvent from "../components/CreateEvent";
import Projects from "../components/Projects";
import SideDashboard from "../components/SideDashboard";
import useSWR from "swr"
import axios from "axios";
import electron from "electron"

const createEvent = () => {
	const [projectsData, setProjectsData] = useState([]);
	const [projectStatus, setProjectStatus] = useState('')

	let log = require('electron-log');

	let api;
	let router = useRouter();
	console.log(router.query);
	let projectType = router.query.status

	if (projectType == "completed") {
		api = `${process.env.DOMAIN_NAME}/api/get-completed-projects/`
		// setProjectStatus('completed')
	} else {
		api = `${process.env.DOMAIN_NAME}/api/get-ongoing-projects/`;
		// setProjectStatus('ongoing')
	}



	const fetcher = async (url) => {
		if (projectType == "completed") {
			// api = `${process.env.DOMAIN_NAME}/api/get-completed-projects/`
			setProjectStatus('completed')
		} else {
			// api = `${process.env.DOMAIN_NAME}/api/get-ongoing-projects/`;
			setProjectStatus('ongoing')
		}
		let token = localStorage.getItem("token");
		try {
			const { data } = await axios.get(url + token);
			if (data.success) {
				setProjectsData(data.projects);
				log.info(`Projects: ${data.projects}`)
				return data;
			} else {
				log.error(`Error: ${data.msg}`)
				return data.msg;
			}
		} catch (error) {
			log.error(`Error: ${error}`)
			return error;
		}
	};


	const { data, error } = useSWR(
		api,
		fetcher
	);



	return (
		<div className="flex">
			<SideDashboard selectedPath={projectStatus} />
			<div className="px-10 pt-5 w-screen max-h-screen flex flex-col">
				<div className="bg-white p-5 rounded-md shadow-md">
					<h1 className="text-2xl font-bold text-gray-800 text-center">

					</h1>
				</div>
				<div className="flex mt-4 h-5/6 gap-5">
					{/* All Projects */}
					<div className="bg-white z-20 lg:w-72 rounded-md overflow-y-auto">
						<Projects projectsData={projectsData} p="create" />
					</div>

					{/* Create Event */}
					<CreateEvent />

				</div>
			</div>
		</div>
	);
};

export default createEvent;
