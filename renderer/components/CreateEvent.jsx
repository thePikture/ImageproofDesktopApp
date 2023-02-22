import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import electron from "electron";
import Swal from "sweetalert2";


const CreateEvent = () => {
	const [eventName, setEventName] = useState("");
	const [validity, setValidity] = useState("");
	const [subscribedValidity, setSubscribedValidity] = useState("")
	const [packageDetails, setPackageDetails] = useState("");
	const [dashboardData, setDashboardData] = useState([])

	let shell = electron.shell;

	let router = useRouter();
	console.log(router.query);
	const log = require('electron-log')

	/* photographer subscription details */

	const subscriptionDetails = async (token) => {
		console.log(token);
		try {
			const { data } = await axios.get(
				`${process.env.DOMAIN_NAME}/api/account/${token}`
			);
			console.log(data);
			setPackageDetails(data.photographer.packageName);

			setValidity(data.photographer.validity);
			setSubscribedValidity(data.photographer.subscribedValidity);
		} catch (error) {
			console.log(error);
		}
	};

	/* Dashboard details */
	const getDashboardData = async (token) => {
		console.log({ token })
		try {
			const { data } = await axios.get(`${process.env.DOMAIN_NAME}/api/get-dashboard-details/${token}`)
			console.log(data, "dashboard")
			setDashboardData(data)
		} catch (error) {
			console.log({ error })
		}
	}

	useEffect(() => {
		const tok = localStorage.getItem("token");
		subscriptionDetails(tok);
		getDashboardData(tok)
	}, []);

	/* Create Event Functionality */
	const handleCreateEvent = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		const projectId = localStorage.getItem("projectId")
		let d;
		// if (router.query.projectId && eventName !== "") {
		if (projectId && eventName !== "") {

			d = {
				eventName,
				// projectId: router.query.projectId
				projectId
			};
			console.log(d)
		}
		/* validity - date of expiry and packageDetails - packages selected or not */
		if (validity && packageDetails !== null) {
			/* bronze - 500 image upload limit */
			if (packageDetails == "bronze" && subscribedValidity) {
				if (dashboardData.uploadedImagesCount < 5000) {
					try {
						const { data } = await axios.post(
							`${process.env.DOMAIN_NAME}/api/create-event/${token}`,
							d
						);
						console.log(data.project);
						// project.info();
						if (data.success) {
							Swal.fire({
								title: "success",
								text: data.msg,
								icon: "success",
								button: "OK!",
							});
							localStorage.setItem("eventId", data.event._id)
							// router.push({
							// 	pathname: "/uploadImages",
							// 	query: { eventId: data.event._id },
							// });
							router.push({
								pathname: "/uploadImages",
							});
							log.info(`Project: ${data.project}`)
						} else {
							log.error(`Error: ${data.msg}`)
							Swal.fire({
								title: "warning",
								text: data.msg,
								icon: "warning",
								button: "OK!",
							});
						}
					} catch (error) {
						log.error(`Error: ${error}`)

						console.log(error);
						// log.warn(`${error}`);
					}
				} else {
					Swal.fire({
						title: "Warning",
						text: "Image limit exceeded for your subscription",
						icon: "warning",
						button: "OK"
					})
				}
			} else if (packageDetails == "silver" && subscribedValidity) {
				/* silver - 25000 image upload limit */
				if (dashboardData.uploadedImagesCount < 25000) {
					try {
						const { data } = await axios.post(
							`${process.env.DOMAIN_NAME}/api/create-event/${token}`,
							d
						);
						console.log(data.project);
						// project.info();
						if (data.success) {
							Swal.fire({
								title: "success",
								text: data.msg,
								icon: "success",
								button: "OK!",
							});
							localStorage.setItem("eventId", data.event._id)

							// router.push({
							// 	pathname: "/uploadImages",
							// 	query: { eventId: data.event._id },
							// });
							router.push({
								pathname: "/uploadImages",
							});
							log.info(`Project: ${data.project}`)
						} else {
							log.error(`Error: ${data.msg}`)
							Swal.fire({
								title: "warning",
								text: data.msg,
								icon: "warning",
								button: "OK!",
							});
						}
					} catch (error) {
						log.error(`Error: ${error}`)

						console.log(error);
						// log.warn(`${error}`);
					}
				} else {
					Swal.fire({
						title: "Warning",
						text: "Image limit exceeded for your subscription",
						icon: "warning",
						button: "OK"
					})
				}
			} else if (packageDetails == "gold" && subscribedValidity) {
				/* gold - 50000 image upload limit */
				console.log("uploadedImages", dashboardData.uploadedImagesCount)
				if (dashboardData.uploadedImagesCount < 50000) {
					try {
						const { data } = await axios.post(
							`${process.env.DOMAIN_NAME}/api/create-event/${token}`,
							d
						);
						console.log(data.project);
						// project.info();
						if (data.success) {
							Swal.fire({
								title: "success",
								text: data.msg,
								icon: "success",
								button: "OK!",
							});
							localStorage.setItem("eventId", data.event._id)

							// router.push({
							// 	pathname: "/uploadImages",
							// 	query: { eventId: data.event._id },
							// });
							router.push({
								pathname: "/uploadImages",
							});
							log.info(`Project: ${data.project}`)
						} else {
							log.error(`Error: ${data.msg}`)
							Swal.fire({
								title: "warning",
								text: data.msg,
								icon: "warning",
								button: "OK!",
							});
						}
					} catch (error) {
						log.error(`Error: ${error}`)

						console.log(error);
						// log.warn(`${error}`);
					}
				} else {
					Swal.fire({
						title: "Warning",
						text: "Image limit exceeded for your subscription",
						icon: "warning",
						button: "OK"
					})
				}
			} else if (packageDetails == "Free Trial") {
				/* Free Trial - 1 project - 2 events and 500 image upload limit */
				if (dashboardData.uploadedImagesCount < 500) {
					try {
						const { data } = await axios.post(
							`${process.env.DOMAIN_NAME}/api/create-event/${token}`,
							d
						);
						console.log(data.project);
						// project.info();
						if (data.success) {
							Swal.fire({
								title: "success",
								text: data.msg,
								icon: "success",
								button: "OK!",
							});
							localStorage.setItem("eventId", data.event._id)

							// router.push({
							// 	pathname: "/uploadImages",
							// 	query: { eventId: data.event._id },
							// });
							router.push({
								pathname: "/uploadImages",
							});
							log.info(`Project: ${data.project}`)
						} else {
							log.error(`Error: ${data.msg}`)
							Swal.fire({
								title: "warning",
								text: data.msg,
								icon: "warning",
								button: "OK!",
							});
						}
					} catch (error) {
						log.error(`Error: ${error}`)

						console.log(error);
						// log.warn(`${error}`);
					}
				} else {
					Swal.fire({
						title: "Warning",
						text: "Image limit exceeded for your subscription",
						icon: "warning",
						button: "OK"
					})
				}
			}

		} else {
			// log.warn(`Please Subscribe to create more projects`);
			Swal.fire({
				title: "warning",
				text: "Please Subscribe to create more projects",
				icon: "warning",
				button: "OK!",
			});
			setTimeout(() => {
				shell.openExternal("https://imageproof.ai/");
			}, 3000);
		}
	};

	return (
		<div className="bg-white z-20 w-5/6 rounded-md overflow-y-auto flex flex-col justify-center items-center">
			<h1 className="text-gray-800 text-2xl font-bold my-5">Create Event</h1>
			<form className="flex flex-col gap-3" onSubmit={handleCreateEvent}>
				<input
					type="text"
					placeholder="Event Name"
					required
					className="text-md shadow-lg p-4 rounded-lg w-96"
					onChange={(e) => { setEventName(e.target.value) }}
				/>

				<button
					type="submit"
					className="bg-gray-900 text-white p-2 rounded-lg shadow-lg text-lg font-bold hover:bg-gray-400 cursor-pointer hover:text-gray-800"
				>
					Create
				</button>
			</form>
		</div>
	);
};

export default CreateEvent;
