import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import CreateProject from '../components/CreateProject';
import useSWR from 'swr'
import SideDashboard from '../components/SideDashboard';
import Projects from '../components/Projects'
import axios from 'axios';

const createProject = () => {
	const [projectsData, setProjectsData] = useState([])
	const [projectStatus, setProjectStatus] = useState('')

	let router = useRouter();
	console.log(router.query);

	let api;

	let log = require('electron-log')


	let projectType = router.query.status



	if (projectType == "completed") {
		api = `${process.env.DOMAIN_NAME}/api/get-completed-projects/`
		// setProjectStatus('completed')
	} else {
		api = `${process.env.DOMAIN_NAME}/api/get-ongoing-projects/`;
		// setProjectStatus('ongoing')
	}





	const fetcher = async (url) => {
		console.log('running');
		console.log({ projectType })
		if (projectType == "completed") {
			// api = `${process.env.DOMAIN_NAME}/api/get-completed-projects/`
			setProjectStatus('completed')
		} else {
			// api = `${process.env.DOMAIN_NAME}/api/get-ongoing-projects/`;
			setProjectStatus('ongoing')
		}

		let token = localStorage.getItem("token");
		try {
			const { data } = await axios.get(api + token);
			console.log(data)
			if (data.success) {
				console.log(data)
				setProjectsData(data.projects);
				log.info(`Projects: ${data.projects}`)
				return data;
			} else {
				setProjectsData([])
				log.error(`Error: ${data.msg}`)
				return data.msg;
			}
		} catch (error) {
			return error;
		}
	};

	const { data, error } = useSWR(
		api,
		fetcher
	);
	console.log(data)

	return (
		<div className="flex">
			<SideDashboard selectedPath={projectStatus} />
			<div className="px-10 pt-5 w-screen max-h-screen flex flex-col">
				<div className="bg-white p-5 rounded-md shadow-md">
					<h1 className="text-2xl font-bold text-gray-800 text-center">
						All Projects
					</h1>
				</div>
				<div className="flex mt-4 h-5/6 gap-5">
					{/* All Projects */}
					<div className="bg-white z-20 lg:w-72 rounded-md overflow-y-auto">
						<Projects projectsData={projectsData} p="create" projectStatus={projectStatus} />
					</div>
					{/* Create Project */}
					{projectStatus == "ongoing" && <CreateProject />}
					{/* Create Event */}
					{/* <CreateEvent /> */}
					{/* Events */}
				</div>
			</div>
		</div>
	);
}

export default createProject