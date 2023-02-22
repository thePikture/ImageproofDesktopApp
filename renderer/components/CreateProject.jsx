import React, { useEffect, useState } from "react";

import electron from "electron"
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";


const CreateProject = () => {

	const [projectName, setProjectName] = useState("");
	const [clientName, setClientName] = useState("");
	const [clientEmail, setClientEmail] = useState("");
	const [clientMobile, setClientMobile] = useState("");
	const [validity, setValidity] = useState("")
	const [subscribedValidity, setSubscribedValidity] = useState("")
	const [packageDetails, setPackageDetails] = useState("")
	const [photographerId, setPhotographerId] = useState("")
	const [dashboardData, setDashboardData] = useState([])

	let shell = electron.shell
	let router = useRouter()
	const log = require('electron-log')

	/* Subscription Details */
	const subscriptionDetails = async (token) => {
		console.log(token);
		try {
			const { data } = await axios.get(
				`${process.env.DOMAIN_NAME}/api/account/${token}`
			);
			console.log(data);
			setPhotographerId(data.photographer._id)
			setPackageDetails(data.photographer.packageName);

			setValidity(data.photographer.validity);
			setSubscribedValidity(data.photographer.subscribedValidity)
		} catch (error) {
			console.log(error);
		}
	};
	/* Dashboard Details */

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
		const tok = localStorage.getItem("token")
		subscriptionDetails(tok)
		getDashboardData(tok)
	}, [])

	/* Create Project Functionality */
	const handleCreateProject = async (e) => {
		e.preventDefault()
		const token = localStorage.getItem("token");
		console.log(validity, subscribedValidity, packageDetails, dashboardData.uploadedImagesCount)

		const d = {
			projectName,
			clientName,
			clientMobile,
			clientEmail,
			photographerId
		};
		/* Validity and Package Details validation */
		if (validity && packageDetails !== null) {
			console.log("running V")
			if (packageDetails == "bronze" && subscribedValidity) {
				/* Image limit validation */
				if (dashboardData.uploadedImagesCount < 5000) {
					try {
						const { data } = await axios.post(
							`${process.env.DOMAIN_NAME}/api/create-project/${token}`,
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
							localStorage.setItem("projectId", data.project._id)
							// router.push({ pathname: '/createEvent', query: { "projectId": data.project._id } })
							router.push({ pathname: '/createEvent' })
							log.info(`Project: ${data.project}`)
						} else {
							Swal.fire({
								title: "warning",
								text: data.msg,
								icon: "warning",
								button: "OK!",
							});
							log.error(`Error: ${data.msg}`)
						}
					} catch (error) {
						console.log(error);
						log.warn(`${error}`);
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
				if (dashboardData.uploadedImagesCount < 25000) {
					try {
						const { data } = await axios.post(
							`${process.env.DOMAIN_NAME}/api/create-project/${token}`,
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
							localStorage.setItem("projectId", data.project._id)

							// router.push({ pathname: '/createEvent', query: { "projectId": data.project._id } })
							router.push({ pathname: '/createEvent' })
							log.info(`Project: ${data.project}`)
						} else {
							Swal.fire({
								title: "warning",
								text: data.msg,
								icon: "warning",
								button: "OK!",
							});
							log.error(`Error: ${data.msg}`)
						}
					} catch (error) {
						console.log(error);
						log.warn(`${error}`);
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
				console.log("uploadedImages", dashboardData.uploadedImagesCount)
				if (dashboardData.uploadedImagesCount < 50000) {
					try {
						const { data } = await axios.post(
							`${process.env.DOMAIN_NAME}/api/create-project/${token}`,
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
							localStorage.setItem("projectId", data.project._id)

							// router.push({ pathname: '/createEvent', query: { "projectId": data.project._id } })
							router.push({ pathname: '/createEvent' })
							log.info(`Project: ${data.project}`)
						} else {
							Swal.fire({
								title: "warning",
								text: data.msg,
								icon: "warning",
								button: "OK!",
							});
							log.error(`Error: ${data.msg}`)
						}
					} catch (error) {
						console.log(error);
						log.warn(`${error}`);
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
				console.log("running FT")
				if (dashboardData.uploadedImagesCount < 500) {
					try {
						const { data } = await axios.post(
							`${process.env.DOMAIN_NAME}/api/create-project/${token}`,
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
							localStorage.setItem("projectId", data.project._id)

							// router.push({ pathname: '/createEvent', query: { "projectId": data.project._id } })
							router.push({ pathname: '/createEvent' })
							log.info(`Project: ${data.project}`)
						} else {
							Swal.fire({
								title: "warning",
								text: data.msg,
								icon: "warning",
								button: "OK!",
							});
							log.error(`Error: ${data.msg}`)
						}
					} catch (error) {
						console.log(error);
						log.warn(`${error}`);
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
			log.warn(`Please Subscribe to create more projects`);
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

	}

	return (
		<div className="bg-white z-20 w-5/6 rounded-md overflow-y-auto flex flex-col justify-center items-center">
			<h1 className="text-gray-800 text-2xl font-bold my-5">Create Project</h1>
			<form className="flex flex-col gap-3" onSubmit={handleCreateProject}>
				<input
					type="text"
					placeholder="Project Name"
					required
					className="text-md shadow-lg p-4 rounded-lg w-96"
					onChange={(e) => {
						setProjectName(e.target.value);
					}}
				/>
				<input
					type="text"
					placeholder="Client Name"
					required
					className="text-md shadow-lg p-4 rounded-lg"
					onChange={(e) => {
						setClientName(e.target.value);
					}}
				/>
				<input
					type="email"
					placeholder="Client Email"
					required
					className="text-md shadow-lg p-4 rounded-lg"
					onChange={(e) => {
						setClientEmail(e.target.value);
					}}
				/>
				<input
					type="text"
					placeholder="Client Mobile"
					required
					className="text-md shadow-lg p-4  rounded-lg"
					onChange={(e) => {
						setClientMobile(e.target.value);
					}}
				/>
				<button
					type="submit"
					className="bg-gray-900 text-white p-4 rounded-lg shadow-lg text-lg font-bold hover:bg-gray-400 cursor-pointer hover:text-gray-800"
				>
					Create
				</button>
			</form>
		</div>
	);
};

export default CreateProject;
