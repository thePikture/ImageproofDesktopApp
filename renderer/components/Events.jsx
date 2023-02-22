import axios from "axios";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router"
import { BiArrowBack } from 'react-icons/bi'

const Events = ({ eventsData, selectedProject, projectStatus, uniqueProject }) => {
	// console.log(eventsData);
	const router = useRouter()

	const [projectName, setProjectName] = useState("")
	const [clientName, setClientName] = useState("")
	const [clientEmail, setClientEmail] = useState("")
	const [clientMobile, setClientMobile] = useState("")
	const [data, setData] = useState([])

	/* Route to event Images or create event */
	const handleRoute = (route, id) => {
		console.log({ id })
		if (id) {
			/* route is eventImages then route to images in that event */
			if (route == "/eventImages") {
				localStorage.setItem("eventId", id)
				localStorage.setItem("projectId", selectedProject)
				// router.push({ pathname: route, query: { "eventId": id, "projectId": selectedProject, "status": projectStatus } })
				router.push({ pathname: route, query: { "status": projectStatus } })
				/* route to create event page */
			} else if (route == "/createEvent") {
				localStorage.setItem("projectId", id)
				router.push({ pathname: route, query: { "status": projectStatus } })

			} else {
				console.log("not found")
			}
		} else {
			if (route == "/createProject") {
				router.push({ pathname: route, query: { "status": projectStatus } })
			}
		}
	}




	useEffect(() => {
		if (eventsData.length > 0) {
			console.log({ eventsData })


			setProjectName(eventsData[0].projectName)
			setClientName(eventsData[0].clientName)
			setClientEmail(eventsData[0].clientEmail)
			setClientMobile(eventsData[0].clientMobile)
		} else {
			console.log("datra")
		}
	}, [])



	return (
		<div className=" z-20 w-5/6 rounded-md overflow-y-auto flex flex-col p-3 bg-white">
			<h1 className="text-xl text-gray-800 font-semibold text-center mb-5">
				Events
			</h1>
			<div className="flex justify-between items-center mb-5">
				<button className="p-2 bg-gray-200 text-gray-900 rounded-full shadow-2xl hover:bg-gray-900 hover:text-white cursor-pointer" onClick={() => { handleRoute("/createProject") }}>

					<BiArrowBack size={20} />
				</button>

				{eventsData.length > 0 && <h1 className="text-gray-800 font-bold ml-10 text-xl">
					{eventsData[0].projectName}
				</h1>}


				{!uniqueProject.completed ? <button className="mb-2 p-2 bg-gray-700 text-white rounded w-1/6 font-bold hover:bg-gray-400 hover:text-gray-700 place-items-end hover:shadow-lg" onClick={() => { handleRoute("/createEvent", selectedProject) }}>
					Create Event
				</button> : <h1 className="mb-2 p-2 bg-gray-700 text-white rounded">Completed</h1>}
			</div>
			<div className="flex gap-5">
				<div className="flex flex-col gap-5 w-4/6">
					{
						eventsData.map((data) => {
							var newDate = data.createdAt.toString();
							var lastDate = new Date(newDate);
							var d = lastDate.toString();
							var resultDate = d.split(" ", 4);
							return (
								<div
									className="p-3 shadow-lg rounded-xl hover:bg-gray-600 hover:text-white group cursor-pointer bg-white border border-gray-200"
									key={data._id}
									onClick={() => handleRoute("/eventImages", data._id)}
								>
									<div className="flex justify-between items-center border-b border-gray-200">
										<h2 className="text-md text-gray-800 font-bold  group-hover:text-white">
											{data.eventName}
										</h2>
										<p className="text-gray-800 text-sm  group-hover:text-white">
											{resultDate[2]}/{resultDate[1]}/{resultDate[3]}
										</p>
									</div>
									<div className="flex justify-around items-center">
										<div>
											<h1 className="text-gray-900 font-semibold text-md  group-hover:text-white">
												Uploaded Images
											</h1>
											<h2 className="text-gray-900 font-semibold text-md text-center  group-hover:text-white">
												{data.uploadedImages.length}
											</h2>
										</div>
										<div>
											<h1 className="text-gray-900 font-semibold text-md  group-hover:text-white">
												Selected Images
											</h1>
											<h2 className="text-gray-900 font-semibold text-md text-center  group-hover:text-white">
												{data.selectedImages.length}
											</h2>
										</div>
									</div>
								</div>
							);
						})}
				</div>
				<div className="p-6 bg-white shadow-lg flex flex-col  rounded-xl w-2/6">
					<h1 className="font-bold text-gray-900 text-lg text-center mb-3">
						Client Details
					</h1>

					{eventsData.length > 0 && <h1 className=" text-gray-900 text-md mb-3">
						<span className="font-bold">Name: </span>
						{eventsData[0].clientName}
					</h1>}


					{eventsData.length > 0 && <h1 className=" text-gray-900 text-md mb-3">
						<span className="font-bold">Email: </span>
						{eventsData[0].clientEmail}
					</h1>}


					{eventsData.length > 0 && <h1 className=" text-gray-900 text-md mb-3">
						<span className="font-bold">Mobile: </span>
						{eventsData[0].clientMobile}
					</h1>}

				</div>
			</div>
		</div>
	);
};

export default Events;
