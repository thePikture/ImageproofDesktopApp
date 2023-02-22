import React, { useEffect, useState } from "react";
import SideDashboard from "../components/SideDashboard";
import useSWR from "swr";
import { useRouter } from "next/router";
import axios from "axios";

import CreateProject from "../components/CreateProject";
import CreateEvent from "../components/CreateEvent";
import Projects from "../components/Projects";
import Events from "../components/Events";

const ongoingProjects = () => {
	const [projectsData, setProjectsData] = useState([]);
	const [selectedProject, setSelectedProject] = useState("");
	const [eventsData, setEventsData] = useState([]);
	const [projectStatus, setProjectStatus] = useState('')
	const [uniqueProject, setUniqueProject] = useState('')

	let log = require('electron-log')


	useEffect(() => {
		// let id = router.query.projectId;
		let id = localStorage.getItem("projectId")
		let projectType = router.query.status

		console.log({ projectType }, { id })
		if (projectType == "completed") {
			setProjectStatus('completed')
		} else {
			setProjectStatus('ongoing')
		}

		if (id) {
			setSelectedProject(id);
			getProjects();
			projectEvents(id);
		}
		projectEvents(id);
	}, []);

	let router = useRouter();

	let api;



	const getProjects = async () => {
		console.log("projects")
		let projectType = router.query.status


		if (projectType == "completed") {
			api = `${process.env.DOMAIN_NAME}/api/get-completed-projects/`
			setProjectStatus('completed')
		} else {
			api = `${process.env.DOMAIN_NAME}/api/get-ongoing-projects/`;
			setProjectStatus('ongoing')
		}
		let token = localStorage.getItem("token");
		try {
			const { data } = await axios.get(api + token);
			if (data.success) {
				setProjectsData(data.projects);
				log.info(`Projects: ${data.projects}`)
			} else {
				log.error(`Error: ${data.msg}`)
				console.log(data.msg);
			}
		} catch (error) {
			log.error(`Error: ${error}`)

			console.log(error);
		}
	};

	const fetcher = async (url) => {
		let projectType = router.query.status

		console.log({ url }, { projectType });
		if (projectType == "completed") {
			api = `${process.env.DOMAIN_NAME}/api/get-completed-projects/`
		} else {
			api = `${process.env.DOMAIN_NAME}/api/get-ongoing-projects/`;
		}
		let token = localStorage.getItem("token");
		try {
			const { data } = await axios.get(api + token);
			console.log(data);
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
	const projectEvents = async (id) => {
		console.log({ id }, "events")
		try {
			if (id.length > 0 && id) {
				let token = localStorage.getItem("token");
				const { data } = await axios.get(
					`${process.env.DOMAIN_NAME}/api/get-unique-project-events/${token}/${id}`
				);
				console.log(data);
				if (data.success) {
					setEventsData(data.projectEvents);
					setUniqueProject(data.project)
					log.info(`Events: ${data.projectEvents}`)
					log.info(`Project: ${data.project}`)
				} else {
					setEventsData([]);
					log.error(`Error: ${data.msg}`)
				}
			}
		} catch (error) {
			log.error(`Error: ${error}`)
			return error;
		}
	};

	const { data, error } = useSWR(api, fetcher);

	console.log(data);
	return (
		<div className="flex">
			<SideDashboard selectedPath={projectStatus} />
			<div className="px-10 pt-5 w-screen max-h-screen flex flex-col">
				<div className="bg-white p-5 rounded-md shadow-md">
					<h1 className="text-2xl font-bold text-gray-800 text-center">
						Ongoing Projects
					</h1>
				</div>
				<div className="flex mt-4 h-5/6 gap-5">
					{/* All Projects */}
					<div className="bg-white z-20 lg:w-72 rounded-md overflow-y-auto">
						{console.log({ projectsData })}
						<Projects
							projectsData={projectsData}
							selectedProject={selectedProject}
							setSelectedProject={setSelectedProject}
							projectEvents={projectEvents}
							projectStatus={projectStatus}
							p="projects"
						/>
					</div>

					{/* Events */}

					<Events eventsData={eventsData} selectedProject={selectedProject} projectStatus={projectStatus} uniqueProject={uniqueProject} />
				</div>
			</div>
		</div>
	);
};

export default ongoingProjects;
