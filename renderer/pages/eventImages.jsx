import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SideDashboard from "../components/SideDashboard";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import Swal from "sweetalert2";
import { BiArrowBack } from "react-icons/bi";
import electron from "electron";
import ModalComp from "../components/ModalComp";


const eventImages = () => {
	let router = useRouter();

	const fs = require('fs')
	const path = require('path')

	const log = require('electron-log')
	let imagesArr = []
	const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];


	const [eventDetails, setEventDetails] = useState([]);
	const [selectTab, setSelectTab] = useState(false);
	const [eventId, setEventId] = useState("");
	const [uploadedImages, setUploadedImages] = useState([]);
	const [selectedImages, setSelectedImages] = useState([]);
	const [photographerDetails, setPhotographerDetails] = useState([])
	const [copiedText, setCopiedText] = useState("")
	const [access, setAccess] = useState(false)
	const [projectId, setProjectId] = useState("")
	const [projectStatus, setProjectStatus] = useState("")
	const [newEvent, setNewEvent] = useState(true)
	const [missingImagesArray, setMissingImagesArray] = useState([])
	const [modalShow, setModalShow] = useState(false)
	const [title, setTitle] = useState("")
	const [alertText, setAlertText] = useState("")
	const [selectedPath, setSelectedPath] = useState("")
	const [selectFolder, setSelectFolder] = useState(true)
	const [diskInfo, setDiskInfo] = useState([]);
	const [allDiskInfo, setAllDiskInfo] = useState([]);


	const ipcRenderer = electron.ipcRenderer || false;
	const nodeDiskInfo = require("node-disk-info");






	const subscriptionDetails = async (token) => {
		console.log(token);
		try {
			const { data } = await axios.get(
				`${process.env.DOMAIN_NAME}/api/account/${token}`
			);
			console.log(data);
			setPhotographerDetails(data.photographer)
			log.info(`Details: ${data.photographer}`)
		} catch (error) {
			log.error(`Error: ${error}`)
			console.log(error);
		}
	};

	useEffect(() => {
		const tok = localStorage.getItem("token")
		subscriptionDetails(tok)
		nodeDiskInfo
			.getDiskInfo()
			.then((disks) => {
				let diskArray = [];
				setAllDiskInfo(disks);
				let l = false;
				let error = 0;
				for (const disk of disks) {
					if (disk.available >= 30 * 1073741824) {
						diskArray.push(disk);
						l = true;
					}
				}
				if (!l) {
					console.log("first");
					Swal.fire({
						title: "Warning",
						text: "Minimum 30GB required in any local drive",
						icon: "warning",
						button: "OK",
					});
				}
				console.log("hi", { diskArray });
				setDiskInfo(diskArray);

			})
			.catch((reason) => {
				console.error(reason);
			});
	}, [])

	// const getImages = (imgs) => {
	// 	console.log({ imgs })
	// 	const photos = imgs.map((img) => {

	// 		console.log({ img })
	// 		let image;

	// 		let createdDate = eventDetails.createdAt
	// 		console.log({ createdDate })
	// 		let date = new Date('2023-01-17')
	// 		console.log({ date })
	// 		let cDate = new Date(createdDate)
	// 		console.log({ cDate })
	// 		console.log("comparision", date > cDate)
	// 		if (date < cDate) {
	// 			image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${img}`
	// 		} else {
	// 			image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${eventId}/${img}`
	// 		}
	// 		return ({
	// 			src: image,
	// 			width: 500,
	// 			height: 500,
	// 			images: breakpoints.map((breakpoint) => {
	// 				const height = Math.round((500 / 500) * breakpoint);
	// 				return {
	// 					src: image,
	// 					width: breakpoint,
	// 					height,
	// 				};
	// 			}),
	// 		})
	// 		// src: unsplashLink(photo.id, photo.width, photo.height),
	// 		// width: photo.width,
	// 		// height: photo.height,
	// 		// images: breakpoints.map((breakpoint) => {
	// 		// 	const height = Math.round((photo.height / photo.width) * breakpoint);
	// 		// 	return {
	// 		// 		src: unsplashLink(photo.id, breakpoint, height),
	// 		// 		width: breakpoint,
	// 		// 		height,
	// 		// 	};
	// 		// }),
	// 	});
	// 	imagesArr = photos
	// 	console.log({ photos })

	// }

	const fetcher = async (url) => {
		let token = localStorage.getItem("token");
		// let eventId = router.query.eventId;
		let eventId = localStorage.getItem("eventId")
		let projectId = localStorage.getItem('projectId')

		setEventId(eventId);
		setProjectId(projectId);
		setProjectStatus(router.query.status)
		try {
			const { data } = await axios.get(url + token + `/${eventId}`);
			if (data.success) {
				setEventDetails(data.projectEvent);
				setSelectedImages(data.projectEvent.selectedImages);
				setUploadedImages(data.projectEvent.uploadedImages);
				setCopiedText(`Click the below link and enter pin to select photos.
			https://proof.imageproof.ai/login/${data.projectEvent._id}
			PIN: ${data.projectEvent.pin}`);
				if (!data.projectEvent.selection) {
					setAccess(true)
				} else {
					setAccess(false)
				}
				let createdDate = data.projectEvent.createdAt
				console.log({ createdDate })
				let date = new Date('2023-01-17')
				console.log({ date })
				let cDate = new Date(createdDate)
				console.log({ cDate })
				console.log("comparision", date > cDate)
				if (date > cDate) {
					setNewEvent(true)
				} else {
					setNewEvent(false)
				}
				console.log(data.projectEvent, "eventsdetails")
				// getImages(data.projectEvent.uploadedImages)

			}
			console.log(data);
			log.info(`Event Details: ${data.projectEvent}`)
			return;
		} catch (error) {
			log.error(`Error: ${error}`)
			return error;
		}
	};

	const handleRoute = (route) => {
		localStorage.setItem("eventId", eventId)
		localStorage.setItem("projectId", projectId)
		// router.push({ pathname: route, query: { eventId, projectId, "status": projectStatus } })
		router.push({ pathname: route, query: { "status": projectStatus } })
	}

	const { data, error } = useSWR(
		`${process.env.DOMAIN_NAME}/api/get-unique-event/`,
		fetcher
	);

	const sendMailtoClient = async () => {
		const clientEmail = eventDetails.clientEmail;
		const pin = eventDetails.pin;
		let token = localStorage.getItem('token')

		const d = {
			clientEmail,
			pin,
			eventId: eventDetails._id,
			photographerEmail: photographerDetails.email,
			studioName: photographerDetails.studioName,
		};
		console.log(d);
		if (eventDetails !== null) {
			if (eventDetails.uploadedImages.length > 0) {
				try {
					console.log(token);
					const { data } = await axios.post(
						`${process.env.DOMAIN_NAME}/api/send-email-to-client/${token}`,
						d
					);
					console.log(data);

					if (data.success) {
						Swal.fire({
							title: "Success",
							text: data.msg,
							button: "Ok!",
							icon: "success",
						});

						const clientInfo = JSON.stringify(d);
						// userlog.info();
						log.info(`Client Email Send Successfully: ${clientInfo}`);
					} else {
						log.error(`${data.msg}`);
						Swal.fire({
							title: "Error",
							text: data.msg,
							button: "Ok!",
							icon: "error",
						});
					}
				} catch (error) {
					console.log(error);
					log.error(`${error}`);
				}
			} else {
				Swal.fire({
					title: "Error",
					text: "Please Upload Images!",
					button: "Ok!",
					icon: "error",
				});
			}
		}
	};

	const selectionAccess = async (eventId) => {
		try {
			const { data } = await axios.put(
				`${process.env.DOMAIN_NAME}/api/photographer/selection-access`,
				{ eventId: eventId }
			);
			console.log(data.msg);
			if (data.success) {
				Swal.fire({
					title: "Success",
					text: data.msg,
					button: "Ok!",
					icon: "success",
				});
				const d = JSON.stringify(data);
				// accessClient.info();
				log.info(`Access to Client: ${d}`);
				log.info(`Client Email: ${clientDetails.clientEmail}`);
			}
		} catch (error) {
			console.log(error);
		}
	};
	function mkdirp(dir) {
		console.log(dir);
		if (fs.existsSync(dir)) {
			console.log(true);
			return true;
		}
		const dirname = path.dirname(dir);
		console.log(dirname);
		mkdirp(dirname);
		fs.mkdirSync(dir);
	}

	const handleCopy = async (filePath, fileName, selectedImagesPath) => {

	}
	let img = []
	let imgs = []

	const copyFiles = async () => {

	}
	let missingImages = []

	const handleDownload = () => {
		setTitle("Disk")
		setAlertText("Please select a disk to download selected images.")
		setSelectFolder(true)
		setModalShow(true)
		console.log({ diskInfo })



	}

	const handleSelectPath = (disk) => {
		console.log({ disk })
		setModalShow(false)
		console.log({ diskInfo })
		handleDownloadImages(disk)
	}


	const handleDownloadImages = async (disk) => {
		setTitle("Download")
		setAlertText("If images are moved to any folder, Please select the folder when window opens.")
		setSelectFolder(false)
		setModalShow(true)
		let createdDate = eventDetails.createdAt
		// console.log({ createdDate })
		let date = new Date('2023-01-17')
		// console.log({ date })
		let cDate = new Date(createdDate)
		// console.log({ cDate })
		console.log("comparision", date > cDate)
		// console.log({ result })

		if (date > cDate) {

			// function mkdirp(dir) {
			// 	console.log(dir);

			// 	fs.mkdirSync(dir);
			// }
			console.log(selectedImages[0])
			let pathArray = selectedImages[0].split("/");
			// console.log(selectedImages[0].split("/"));
			let eventName = eventDetails.eventName;
			let projectName = eventDetails.projectName
			// let selectedImagesPath = `C:/Imageproof/${projectName}/${eventName}/Selected Images/`
			// console.log({ selectedImagesPath })
			let selectedImagesPath = `${pathArray[0]}/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}/Selected Images/`;
			console.log(
				`${pathArray[0]}/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}/`
			);


			if (fs.existsSync(selectedImagesPath)) {
				fs.rmSync(selectedImagesPath, { recursive: true });
				console.log(true);
				// return true;
			}
			// fs.mkdirp(selectedImagesPath);
			// mkdirp(
			// 	selectedImagesPath
			// );
			mkdirp(selectedImagesPath);
			selectedImages.map((image) => {
				// console.log(image.replaceAll(/-/gi, "/"))
				// let img = image.split("/");
				// console.log({ img })
				// console.log(img[0].replaceAll(/-/gi, "/"), "replace")
				const filePath = `${image.split(".")[0]}`;
				// const filePath = img[0].replaceAll(/-/gi, "/")
				const fileName = path.basename(filePath).split(".")[0];
				// const fileName = img[1].split(".")[0]
				console.log(filePath);
				console.log(fileName);
				console.log(`${selectedImagesPath}${fileName}.jpeg`);

				fs.copyFile(`${filePath}.jpeg`, `${selectedImagesPath}${fileName}.jpeg`, (err) => {
					if (err) {
						console.log(err)
					}
					console.log("Image " + fileName + " stored.");
					log.info("Images Copied to local folder")
					// At that point, store some information like the file name for later use
				});
				fs.copyFile(`${filePath}.jpg`, `${selectedImagesPath}${fileName}.jpg`, (err) => {
					if (err) {
						console.log(err)
					}
					console.log("Image " + fileName + " stored.");
					log.info("Images Copied to local folder")

					// At that point, store some information like the file name for later use
				});
				fs.copyFile(`${filePath}.png`, `${selectedImagesPath}${fileName}.png`, (err) => {
					if (err) {
						console.log(err)
					}
					console.log("Image " + fileName + " stored.");
					log.info("Images Copied to local folder")

					// At that point, store some information like the file name for later use
				});
				Swal.fire({
					titile: "Success",
					text: "Selected Image folder Downloaded",
					icon: "success",
					button: "Ok!",
				});
			});
		} else {
			// function mkdirp(dir) {
			// 	console.log(dir);

			// 	fs.mkdirSync(dir);
			// }
			console.log(selectedImages[0])
			// let pathArray = selectedImages[0].split("/");
			// console.log(selectedImages[0].split("/"));
			let eventName = eventDetails.eventName;
			let projectName = eventDetails.projectName

			// let selectedImagesPath = `C:/Imageproof/${projectName}/${eventName}/Selected Images/`
			let selectedImagesPath = `${disk}/Imageproof/${projectName}/${eventName}/Selected Images/`
			console.log({ selectedImagesPath })
			// let selectedImagesPath = `${pathArray[0]}/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}/Selected Images/`;
			// console.log(
			// 	`${pathArray[0]}/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}/`
			// );


			if (fs.existsSync(selectedImagesPath)) {
				fs.rmSync(selectedImagesPath, { recursive: true });
				console.log(true);
				// return true;
			}
			// fs.mkdirp(selectedImagesPath);
			mkdirp(
				selectedImagesPath
			);
			// mkdirp(selectedImagesPath);
			selectedImages.map(async (image, index) => {
				// console.log(image.replaceAll(/-/gi, "/"))
				let img = image.split("/");
				console.log({ img })
				console.log(img[0].replaceAll(/-/gi, "/"), "replace")
				// const filePath = `${image.split(".")[0]}`;
				const filePath = img[0].replaceAll(/-/gi, "/")
				// const fileName = path.basename(filePath);
				const fileName = img[1].split(".")[0]
				console.log(filePath);
				console.log(fileName);
				console.log(`${selectedImagesPath}${fileName}.jpeg`);
				let missed = false




				await fs.copyFile(`${filePath}${fileName}.jpeg`, `${selectedImagesPath}${fileName}.jpeg`, (err) => {
					if (err) {
						fs.copyFile(`${filePath}${fileName}.jpg`, `${selectedImagesPath}${fileName}.jpg`, (err) => {
							if (err) {
								let i = 0
								fs.copyFile(`${filePath}${fileName}.png`, `${selectedImagesPath}${fileName}.png`, (err) => {
									if (err) {
										console.log(err)
										handleImages(fileName)
										missingImages.push(fileName)
										console.log(selectedImages.length, index, "index")
										if (selectedImages.length - 1 == index) {
											console.log("running")
										}

										// setMissingImagesArray(...missingImagesArray, fileName)



									} else {

										console.log("Image " + fileName + " stored.");
										log.info("Images Copied to local folder")
									}
									// return missingImages
									console.log({ missingImages })
									// if (missingImages) {
									// setMissingImagesArray(missingImages)
									// 
									// }

									// At that point, store some information like the file name for later use
								});
							} else {

								console.log("Image " + fileName + " stored.");
								log.info("Images Copied to local folder")
							}
						})


					} else {

						console.log("Image " + fileName + " stored.");
						log.info("Images Copied to local folder")
					}
					console.log({ missingImages }, missingImages.length)
					// return missingImages

				})

				// Swal.fire({
				// 	titile: "Success",
				// 	text: "Selected Image folder Downloaded",
				// 	icon: "success",
				// 	button: "Ok!",
				// });
			});


			// handleCheck(missingImagesArray)

		}


	};
	const handleImages = (fileName) => {
		img.push(fileName)
		imgs.push(fileName)
		console.log({ missingImagesArray }, { fileName }, { img })
		setMissingImagesArray(img)
		// handleCheck()
	}
	console.log({ img })
	const handleCheck = () => {
		setModalShow(false)
		console.log({ img }, { missingImagesArray }, { imgs })
		if (missingImagesArray.length > 0) {

			if (ipcRenderer) {
				ipcRenderer.invoke('openDirectory').then(result => {
					console.log({ result })
					handleSearch(result, missingImagesArray)
				})
			}
		} else {
			Swal.fire({
				titile: "Success",
				text: "Selected Images folder Downloaded",
				icon: "success",
				button: "Ok!",
			});
		}


	}

	const handleSearch = async (folderPath, missingImages) => {
		console.log({ folderPath }, { missingImages })

		let eventName = eventDetails.eventName;
		let projectName = eventDetails.projectName
		let selectedImagesPath = `C:/Imageproof/${projectName}/${eventName}/Selected Images/`
		let filePath = folderPath
		selectedImages.map((image) => {
			let img = image.split("/");
			console.log({ img })
			console.log(img[0].replaceAll(/-/gi, "/"), "replace")
			// const filePath = `${image.split(".")[0]}`;
			// const filePath = img[0].replaceAll(/-/gi, "/")
			// const fileName = path.basename(filePath);
			const fileName = img[1].split(".")[0]
			console.log(filePath);
			console.log(fileName);
			console.log(`${selectedImagesPath}${fileName}.jpeg`);
			fs.copyFile(`${filePath}/${fileName}.jpeg`, `${selectedImagesPath}${fileName}.jpeg`, (err) => {
				if (err) {
					fs.copyFile(`${filePath}/${fileName}.jpg`, `${selectedImagesPath}${fileName}.jpg`, (err) => {
						if (err) {
							fs.copyFile(`${filePath}/${fileName}.png`, `${selectedImagesPath}${fileName}.png`, (err) => {
								if (err) {
									console.log(err)
								} else {

									console.log("Image " + fileName + " stored.");
									log.info("Images Copied to local folder")
								}

								// At that point, store some information like the file name for later use
							});
						} else {

							console.log("Image " + fileName + " stored.");
							log.info("Images Copied to local folder")
						}
					})
				} else {

					console.log("Image " + fileName + " stored.");
					log.info("Images Copied to local folder")
				}
			})
		})



	}

	const handleComplete = async () => {
		try {
			let d = {
				eventId: eventDetails._id
			}
			const { data } = await axios.put(`${process.env.DOMAIN_NAME}/api/photographer/event-complete`, d)
			if (data.success) {
				Swal.fire({
					titile: "Success",
					text: data.msg,
					icon: "success",
					button: "Ok!",
				});
			} else {
				Swal.fire({
					titile: "Warning",
					text: data.msg,
					icon: "warning",
					button: "Ok!",
				});
				log.error(`${data.msg}`)
			}
		} catch (error) {
			log.error(`${error}`)

			console.log({ error })
		}
	}

	const handleBack = (route) => {
		if (route) {
			localStorage.setItem("projectId", projectId)
			// router.push({ pathname: route, query: { "projectId": projectId, "status": projectStatus } })
			router.push({ pathname: route, query: { "status": projectStatus } })
		}
	}

	const handleImage = async (image, type) => {
		// let index = selectedImages.indexOf(image)
		if (type == "uploaded") {
			console.log({ eventDetails })
			localStorage.setItem("projectId", projectId)
			localStorage.setItem("eventId", eventId)
			// router.push({ pathname: '/carousel', query: { "images": uploadedImages, eventId, projectId, "status": projectStatus, "image": image, "eventDetails": eventDetails.createdAt } })
			router.push({ pathname: '/carousel', query: { "images": uploadedImages, "status": projectStatus, "image": image, "eventDetails": eventDetails.createdAt } })
		} else if (type == "selected") {
			localStorage.setItem("projectId", projectId)
			localStorage.setItem("eventId", eventId)
			// router.push({ pathname: '/carousel', query: { "images": selectedImages, eventId, projectId, "status": projectStatus, "image": image, "eventDetails": eventDetails.createdAt } })
			router.push({ pathname: '/carousel', query: { "images": selectedImages, "status": projectStatus, "image": image, "eventDetails": eventDetails.createdAt } })
		} else {
			console.log("type not found")
		}
	}

	const handleClose = () => {
		setModalShow(false)
	}


	return (
		<div className="flex">
			<SideDashboard selectedPath={projectStatus} />
			<div className="px-10 pt-5 h-screen w-screen flex flex-col group">
				<div className="bg-white p-5 rounded-md shadow-md">
					<h1 className="text-2xl font-bold text-gray-800 text-center">
						Ongoing Projects
					</h1>
				</div>

				<div className="flex gap-5 mt-5">

					<div className="w-80">
						<div className="bg-white py-8 px-4 rounded-lg shadow-lg">
							{console.log(eventDetails)}
							<h1 className="text-lg text-gray-800 font-bold mb-3 text-center">
								Event Details
							</h1>
							<div className="flex justify-between items-center mb-2">
								<h1 className="font-bold">Project Name: </h1>
								<h2 className="text-gray-800 text-md font-semibold">
									{eventDetails.projectName}
								</h2>
							</div>
							<div className="flex justify-between items-center mb-2">
								<h1 className="font-bold">Event Name: </h1>
								<h2 className="text-gray-800 text-md font-semibold">
									{eventDetails.eventName}
								</h2>
							</div>
							<div className="flex justify-between items-center mb-2">
								<h1 className="font-bold">Name: </h1>
								<h2 className="text-gray-800 text-md font-semibold">
									{eventDetails.clientName}
								</h2>
							</div>
							<div className="flex justify-between items-center mb-2">
								<h1 className="font-bold">Email: </h1>
								<h2 className="text-gray-800 text-md font-semibold">
									{eventDetails.clientEmail}
								</h2>
							</div>
							<div className="flex justify-between items-center mb-2">
								<h1 className="font-bold">Mobile: </h1>
								<h2 className="text-gray-800 text-md font-semibold mb-2">
									{eventDetails.clientMobile}
								</h2>
							</div>


							<div className="text-center">
								{!eventDetails.completed && <button className="p-3 bg-gray-800 text-white font-bold hover:bg-gray-200 hover:text-gray-800 rounded-xl shadow-lg hover:shadow-2xl" onClick={() => { handleRoute("/uploadImages") }}>
									Upload
								</button>}
							</div>

						</div>
						<div className="bg-white mt-5 py-5 px-5 rounded-lg shadow-lg flex flex-col items-center">
							{!eventDetails.completed && uploadedImages.length > 0 && <button className="p-2 bg-green-600 rounded-lg text-white w-28 text-md font-semibold hover:bg-green-400  mb-2" onClick={() => sendMailtoClient()}>
								Send Link
							</button>}
							{copiedText.length > 0 && !eventDetails.completed && uploadedImages.length > 0 && <button className="p-2 bg-orange-600 rounded-lg text-white w-28 text-md font-semibold hover:bg-orange-400  mb-2" onClick={() => {
								navigator.clipboard.writeText(copiedText);
								Swal.fire({
									title: "Success",
									text: "Link copied",
									button: "Ok!",
									icon: "success",
								});
							}}>
								Copy Link
							</button>}
							{access && !eventDetails.completed && <button className="p-2 bg-red-600 rounded-lg text-white w-28 text-md font-semibold hover:bg-red-400  mb-2" onClick={() => selectionAccess(eventDetails._id)}>
								Access
							</button>}
							{access && selectedImages.length > 0 && !eventDetails.completed && <button className="p-2 bg-blue-600 rounded-lg text-white w-28 text-md font-semibold hover:bg-blue-400  mb-2" onClick={handleDownload}>
								Download
							</button>}
							{!eventDetails.completed && !eventDetails.selection && <button className="p-2 bg-gray-800 rounded-lg text-white w-28 text-md font-semibold hover:bg-gray-200 hover:text-gray-800 mb-2" onClick={handleComplete}>
								Completed
							</button>}
						</div>
					</div>
					{/* Images */}
					{modalShow && <div className="w-full h-full bg-gray-200 flex justify-center items-center">
						<ModalComp title={title} alertText={alertText} selectFolder={selectFolder} handleCheck={handleCheck} handleSelectPath={handleSelectPath} diskInfo={diskInfo} />
					</div>}

					{!modalShow && <div className=" bg-white rounded-xl w-10/12 h-[600px] overflow-y-auto">
						<div>
							<div className="sticky top-0 z-40 bg-white p-3">
								<div className="place-content-start">

									<button className=" p-2 bg-gray-200 text-gray-900 rounded-full shadow-2xl hover:bg-gray-900 hover:text-white cursor-pointer" onClick={() => handleBack("/projectDshboard")} >

										<BiArrowBack size={20} />
									</button>
								</div>
								<div className="flex items-center justify-center mb-10">

									<button
										className={
											selectTab
												? "p-3 bg-gray-100 rounded-lg shadow-xl text-gray-500 font-bold mr-10 hover:bg-gray-700 hover:text-white"
												: "p-3 bg-gray-700 rounded-lg shadow-xl text-white font-bold mr-10 hover:bg-gray-300 hover:text-gray-700"
										}
										onClick={() => {
											setSelectTab(false);
										}}
									>
										Uploaded- {uploadedImages.length}
									</button>
									<button
										className={
											!selectTab
												? "p-3 bg-gray-100 rounded-lg shadow-xl text-gray-500 font-bold mr-10 hover:bg-gray-700 hover:text-white"
												: "p-3 bg-gray-700 rounded-lg shadow-xl text-white font-bold mr-10 hover:bg-gray-300 hover:text-gray-700"
										}
										onClick={() => {
											setSelectTab(true);
										}}
									>
										Selected - {selectedImages.length}
									</button>
								</div>
							</div>

							{!selectTab && (
								<div className="container grid grid-cols-3 gap-2 mx-auto mt-5 p-2">

									{
										uploadedImages.length > 0 &&
										uploadedImages.map((img) => {
											let image;

											let createdDate = eventDetails.createdAt
											console.log({ createdDate })
											let date = new Date('2023-01-17')
											console.log({ date })
											let cDate = new Date(createdDate)
											console.log({ cDate })
											console.log("comparision", date > cDate)
											if (date < cDate) {
												image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${img}`
											} else {
												image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${eventId}/${img}`
											}
											console.log({ image });

											// imagesArr.push(image)
											return (
												<Image

													src={image}
													alt="Images"
													height={200}
													width={100}
													objectFit="cover"
													className="rounded-xl cursor-pointer"
													onClick={() => { handleImage(img, "uploaded") }}
												/>
											);
										})
									}
								</div>
								// <PhotoAlbum photos={imagesArr} layout="masonry" />

							)}
							{selectTab && (
								<div className="container grid grid-cols-3 gap-2 mx-auto mt-5 p-2">
									{selectedImages.length > 0 &&
										selectedImages.map((img) => {
											let image;

											let createdDate = eventDetails.createdAt
											console.log({ createdDate })
											let date = new Date('2023-01-17')
											console.log({ date })
											let cDate = new Date(createdDate)
											console.log({ cDate })
											console.log("comparision", date > cDate)
											if (date < cDate) {
												image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${img}`
											} else {
												image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${eventId}/${img}`
											}
											console.log({ image })
											return (
												<Image
													src={image}
													alt="Images"
													height={200}
													width={100}
													objectFit="cover"
													className="rounded-xl shadow-lg cursor-pointer"
													onClick={() => { handleImage(img, "selected") }}
												/>
											);
										})}
								</div>
							)}

						</div>
					</div>}
				</div>
			</div>
		</div >
	);
};

export default eventImages;