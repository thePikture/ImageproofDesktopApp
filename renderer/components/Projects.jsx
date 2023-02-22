import { useRouter } from "next/router";
import React from "react";
import { HiFolder } from "react-icons/hi";

const Projects = ({
	projectsData,
	selectedProject,
	setSelectedProject,
	projectEvents,
	p,
	projectStatus
}) => {
	console.log({ projectsData }, { selectedProject })
	const router = useRouter();
	const handleRoute = (route, id) => {
		if (p == "create") {
			console.log({ projectStatus })
			localStorage.setItem("projectId", id)
			// router.push({ pathname: route, query: { projectId: id, "status": projectStatus } });
			router.push({ pathname: route, query: { "status": projectStatus } });
		} else if (p == "projects") {
			console.log({ projectStatus }, "hello")
			console.log({ id });
			setSelectedProject(id);
			projectEvents(id);
		} else {
			console.log("no");
		}
		// router.push({pathname: route, query:{"projectId":id}})
	};
	return (
		<div className="flex flex-col justify-start ">
			<h1 className="text-base text-gray-800  font-bold text-center my-2">
				Projects
			</h1>
			{projectsData.length > 0 && projectsData.map((project) => (
				<>
					{selectedProject == undefined && <div
						key={project._id}
						className="flex mb-2 justify-start gap-4 px-5 hover:bg-gray-900 py-2 rounded-md group cursor-pointer hover:shadow-lg"
						onClick={() => handleRoute("/projectDashboard", project._id)}
					>
						<HiFolder className="text-2xl text-gray-600 group-hover:text-white" />
						<h2 className="text-base text-gray-800 group-hover:text-white font-semibold">
							{project.projectName}
						</h2>
					</div>}
					{selectedProject == project._id &&
						<div
							key={project._id}
							className="flex mb-2 justify-start gap-4 px-5 bg-gray-900 py-2 rounded-md group cursor-pointer hover:shadow-lg"
							onClick={() => handleRoute("/projectDashboard", project._id)}
						>
							<HiFolder className="text-2xl text-white" />
							<h2 className="text-base text-white font-semibold">
								{project.projectName}
							</h2>
						</div>
					}
					{selectedProject != project._id && selectedProject != undefined &&
						<div
							key={project._id}
							className="flex mb-2 justify-start gap-4 px-5 hover:bg-gray-400 py-2 rounded-md group cursor-pointer hover:shadow-lg"
							onClick={() => handleRoute("/projectDashboard", project._id)}
						>
							<HiFolder className="text-2xl text-gray-600 group-hover:text-white" />
							<h2 className="text-base text-gray-800 group-hover:text-white font-semibold">
								{project.projectName}
							</h2>
						</div>
					}
				</>
			))}
			{projectsData.length < 1 && <div className="text-center">
				No projects</div>}
		</div>
	);
};

export default Projects;
