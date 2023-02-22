import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SideDashboard from "../components/SideDashboard";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import electron from "electron";
import Resizer from "react-image-file-resizer";
import Swal from "sweetalert2";

import Progress from 'react-progressbar';


const uploadImages = () => {
	let router = useRouter();

	const nodeDiskInfo = require("node-disk-info");
	const fs = require('fs')
	const path = require('path')

	const [eventDetails, setEventDetails] = useState([[]]);
	const [eventId, setEventId] = useState("");
	const [showImages, setShowImages] = useState([]);
	const [selectedImages, setSelectedImages] = useState([]);
	const [validity, setValidity] = useState("");
	const [packageDetails, setPackageDetails] = useState("");
	const [diskInfo, setDiskInfo] = useState([]);
	const [allDiskInfo, setAllDiskInfo] = useState([]);
	const [showDisks, setShowDisks] = useState(false);
	const [compressedImages, setCompressedImages] = useState([])
	const [verify, setVerify] = useState(true)
	const [progress, setProgress] = useState(0)
	const [loading, setLoading] = useState(false)
	const [projectId, setProjectId] = useState("")
	const [projectStatus, setProjectStatus] = useState("")
	const [show, setShow] = useState(false)
	const [imagesLength, setImagesLength] = useState(0)
	const [compressingLength, setCompressingLength] = useState(0)
	const [dashboardData, setDashboardData] = useState([])



	const subscriptionDetails = async (token) => {
		console.log(token);
		try {
			const { data } = await axios.get(
				`${process.env.DOMAIN_NAME}/api/account/${token}`
			);
			console.log(data);
			setPackageDetails(data.photographer.packageName);

			setValidity(data.photographer.subscribedValidity);
		} catch (error) {
			console.log(error);
		}
	};
	const getDashboardDetails = async (token) => {
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
		getDashboardDetails(tok)
		// nodeDiskInfo
		// 	.getDiskInfo()
		// 	.then((disks) => {
		// 		let diskArray = [];
		// 		setAllDiskInfo(disks);
		// 		let l = false;
		// 		let error = 0;
		// 		for (const disk of disks) {
		// 			if (disk.mounted == "C:" && disk.available >= 30 * 1073741824) {
		// 				diskArray.push(disk);
		// 				l = true;
		// 			}
		// 		}
		// 		if (!l) {
		// 			console.log("first");
		// 			Swal.fire({
		// 				title: "Warning",
		// 				text: "Minimum 30GB required in any local drive",
		// 				icon: "warning",
		// 				button: "OK",
		// 			});
		// 		}
		// 		console.log("hi", { diskArray });
		// 		setDiskInfo(diskArray);

		// 	})
		// 	.catch((reason) => {
		// 		console.error(reason);
		// 	});
	}, []);
	// useEffect(() => {
	// 	if (compressedImages.length == selectedImages.length) {
	// 		console.log("runnug")
	// 		setVerify(true)
	// 	}
	// },[compressedImages])

	let shell = electron.shell;



	const handleImages = async (e) => {
		setVerify(false)
		console.log(e.target.files);


		const fileArray = Array.from(e.target.files).map((file) => file);

		if (validity == false) {
			if (dashboardData.uploadedImagesCount < 500) {
				if (e.target.files.length + dashboardData.uploadedImagesCount <= 500) {
					const fileArray = Array.from(e.target.files).map((file) => file);
					const showImageArray = Array.from(e.target.files).map((file) =>
						URL.createObjectURL(file)
					);
					console.log(fileArray);
					setImagesLength(fileArray.length)
					let arra = fileArray.forEach(async (file) => {
						// setLoading(true)
						const image = await resizeFile(file, showImageArray.length);
					})
					// setLoading(false)
					// console.log({ result })
					setShowImages(showImageArray);
					setSelectedImages((prevIages) => prevIages.concat(fileArray));
					setShowImages((prevIages) => prevIages.concat(showImages));
					Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
				} else {
					log.warn(
						`Only 500 images Allowed... Please Subscribe to Upload more Images`
					);
					Swal.fire({
						title: "Warning",
						text: "Only 500 images Allowed... Please Subscribe to Upload more Images",
						icon: "warning",
						button: "OK!",
					});
					setTimeout(() => {
						shell.openExternal("http://imageproof.ai/");
					}, 3000);
				}
			} else {
				Swal.fire({
					title: "Warning",
					text: `Image upload limit exceeded for you subscription.`,
					icon: 'warning',
					button: "OK"
				})
			}

		} else {
			if (packageDetails == "bronze") {
				if (dashboardData.uploadedImagesCount < 5000) {
					if (e.target.files.length + dashboardData.uploadedImagesCount <= 5000) {
						const fileArray = Array.from(e.target.files).map((file) => file);
						const showImageArray = Array.from(e.target.files).map((file) =>
							URL.createObjectURL(file)
						);
						console.log(fileArray);
						setImagesLength(showImageArray.length)

						console.log(showImageArray.length, "length")
						let arra = fileArray.forEach(async (file) => {
							console.log(showImageArray.length)
							const image = await resizeFile(file, showImageArray.length);
						})



						setShowImages(showImageArray);
						setSelectedImages((prevIages) => prevIages.concat(fileArray));
						setShowImages((prevIages) => prevIages.concat(showImages));
						Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
					} else {
						Swal.fire({
							title: "Warning",
							text: `${dashboardData.uploadedImagesCount} images uploaded. You can upload ${5000 - dashboardData.uploadedImagesCount} images.`,
							icon: 'warning',
							button: "OK"
						})
					}
				} else {
					Swal.fire({
						title: "Warning",
						text: `Image upload limit exceeded for you subscription.`,
						icon: 'warning',
						button: "OK"
					})
				}
			} else if (packageDetails == "silver") {
				if (dashboardData.uploadedImagesCount < 25000) {
					if (e.target.files.length + dashboardData.uploadedImagesCount <= 25000) {
						const fileArray = Array.from(e.target.files).map((file) => file);
						const showImageArray = Array.from(e.target.files).map((file) =>
							URL.createObjectURL(file)
						);
						console.log(fileArray);
						setImagesLength(showImageArray.length)

						console.log(showImageArray.length, "length")
						let arra = fileArray.forEach(async (file) => {
							console.log(showImageArray.length)
							const image = await resizeFile(file, showImageArray.length);
						})



						setShowImages(showImageArray);
						setSelectedImages((prevIages) => prevIages.concat(fileArray));
						setShowImages((prevIages) => prevIages.concat(showImages));
						Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
					} else {
						Swal.fire({
							title: "Warning",
							text: `${dashboardData.uploadedImagesCount} images uploaded. You can upload ${5000 - dashboardData.uploadedImagesCount} images.`,
							icon: 'warning',
							button: "OK"
						})
					}
				} else {
					Swal.fire({
						title: "Warning",
						text: `Image upload limit exceeded for you subscription.`,
						icon: 'warning',
						button: "OK"
					})
				}
			} else if (packageDetails == "gold") {
				if (dashboardData.uploadedImagesCount < 50000) {
					if (e.target.files.length + dashboardData.uploadedImagesCount <= 50000) {
						const fileArray = Array.from(e.target.files).map((file) => file);
						const showImageArray = Array.from(e.target.files).map((file) =>
							URL.createObjectURL(file)
						);
						console.log(fileArray);
						setImagesLength(showImageArray.length)

						console.log(showImageArray.length, "length")
						let arra = fileArray.forEach(async (file) => {
							console.log(showImageArray.length)
							console.log({ file })
							const image = await resizeFile(file, showImageArray.length);
						})



						setShowImages(showImageArray);
						setSelectedImages((prevIages) => prevIages.concat(fileArray));
						setShowImages((prevIages) => prevIages.concat(showImages));
						Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
					} else {
						Swal.fire({
							title: "Warning",
							text: `${dashboardData.uploadedImagesCount} images uploaded. You can upload ${50000 - dashboardData.uploadedImagesCount} images.`,
							icon: 'warning',
							button: "OK"
						})
					}
				} else {
					Swal.fire({
						title: "Warning",
						text: `Image upload limit exceeded for you subscription.`,
						icon: 'warning',
						button: "OK"
					})
				}
			}

		}
		// setVerify(true)
	};

	const fetcher = async (url) => {
		let token = localStorage.getItem("token");
		// let eventId = router.query.eventId;
		let eId = localStorage.getItem('eventId')
		let projectId = localStorage.getItem('projectId')
		// setEventId(router.query.eventId);
		// setProjectId(router.query.projectId)
		console.log({ eId })
		setEventId(eId);
		setProjectId(projectId)
		setProjectStatus(router.query.status)
		try {
			const { data } = await axios.get(url + token + `/${eId}`);
			console.log(data);
			if (data.success) {
				setEventDetails(data.projectEvent);
			}

		} catch (error) {
			return error;
		}
	};

	useEffect(() => {
		fetcher(`${process.env.DOMAIN_NAME}/api/get-unique-event/`)
	}, [])

	// const { data, error } = useSWR(
	// 	`${process.env.DOMAIN_NAME}/api/get-unique-event/`,
	// 	fetcher
	// );

	// const checkDiskSpace = (e) => {
	// 	e.preventDefault();
	// 	console.log("disk running");
	// 	if (diskInfo.length > 0) {

	// 		if (selectedImages.length > 0) {

	// 			setShowDisks(true);
	// 		} else {
	// 			Swal.fire({
	// 				title: "Warning",
	// 				text: "Images not selected",
	// 				icon: "warning",
	// 				button: "OK!",
	// 			})
	// 			console.log("images not found")
	// 		}
	// 	} else {
	// 		Swal.fire({
	// 			title: "Warning",
	// 			text: "Minimum 30GB required in any local drive",
	// 			icon: "warning",
	// 			button: "OK!",
	// 		})
	// 	}

	// };

	// const selectDisk = (disk) => {
	// 	console.log(disk);
	// 	function mkdirp(dir) {
	// 		console.log(dir);
	// 		if (fs.existsSync(dir)) {
	// 			console.log(true);
	// 			return true;
	// 		}
	// 		const dirname = path.dirname(dir);
	// 		console.log(dirname);
	// 		mkdirp(dirname);
	// 		fs.mkdirSync(dir);
	// 	}
	// 	mkdirp(
	// 		`${disk}/Imageproof/${eventDetails.projectName}/${eventDetails.eventName}/Original`
	// 	);
	// 	uploadToLocal(
	// 		`${disk}/Imageproof/${eventDetails.projectName}/${eventDetails.eventName}/Original`,
	// 		disk
	// 	);
	// 	const lowQuality = mkdirp(
	// 		`${disk}/Imageproof/${eventDetails.projectName}/${eventDetails.eventName}/Thumbnail`
	// 	);
	// 	// lowQualityImages(
	// 	//   `${disk}/Imageproof/${clientDetail.projectName}/${clientDetail.eventName}/Thumbnail`
	// 	// );
	// };

	// Image Upload to Local Folder

	// const uploadToLocal = async (folderPath, disk) => {
	// 	setShowDisks(false);
	// 	let fileN;
	// 	selectedImages.map((image) => {
	// 		const filePath = `${image.path}`;
	// 		const fileName = path.basename(filePath);
	// 		console.log(filePath);
	// 		console.log(fileName);
	// 		console.log(folderPath);
	// 		fs.copyFile(filePath, folderPath + "/" + fileName, (err) => {
	// 			if (err) throw err;
	// 			console.log("Image " + fileName + " stored.");
	// 			// At that point, store some information like the file name for later use
	// 		});
	// 	});
	// 	uploadPhotos(selectedImages, folderPath + "/");
	// };



	const resizeFile = (file, arrLength) => {
		let imagesArray = compressedImages
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				500,
				500,
				"WEBP",
				100,
				0,
				(uri) => {
					console.log(uri, file.path, file.name)

					console.log(uri.path)
					console.log({ verify })
					let ip = file.path.replace(file.name, "")
					console.log({ ip })
					let imagePath = ip.replaceAll(/\\/gi, "-")
					console.log({ eventDetails })
					console.log({ imagePath })
					imagesArray.push({ uri, imagePath })
					setCompressingLength(imagesArray.length)
					console.log(arrLength, imagesArray.length, selectedImages.length == imagesArray.length)
					if (arrLength == imagesArray.length) {
						setVerify(true)
					}
					setCompressedImages(imagesArray)

					console.log({ compressedImages })
				},
				"file",
				300,
				300
			);
		})


	}



	// Upload Function
	const uploadPhotos = async (e) => {
		e.preventDefault()
		const token = localStorage.getItem('token')

		console.log({ compressedImages })
		// checkDiskSpace();
		// console.log(folderPath);
		// uploadimg.info();
		// setLoading(true);
		console.log(selectedImages);
		let imagesUploaded = 0;
		let uploadCompleted = true;
		// console.log({ apiImages });

		if (compressedImages.length == selectedImages.length && compressedImages.length > 0) {
			setLoading(true)

			for (let i = 0; i < compressedImages.length; i++) {
				let formData = new FormData;
				console.log(compressedImages[i].uri)
				formData.append("files", compressedImages[i].uri)
				let imagePath = [compressedImages[i].imagePath]
				formData.append("path", compressedImages[i].imagePath)
				console.log({ imagePath })
				console.log({ formData })
				let eventName = eventDetails.eventName
				let projectName = eventDetails.projectName

				try {
					const { data } = await axios.put(
						`${process.env.DOMAIN_NAME}/api/upload_images/${token}/${eventId}`,
						formData
					);
					if (data.success) {
						console.log(`image uploaded`);
						let p = Math.round(((i + 1) * 100) / selectedImages.length);
						setProgress(p)

					}
				} catch (error) {

					console.log(error);

				}
			}
			setLoading(false)
			localStorage.setItem("eventId", eventId)
			localStorage.setItem("projectId", projectId)
			// router.push({ pathname: '/eventImages', query: { eventId, projectId, "status": projectStatus } })
			router.push({ pathname: '/eventImages', query: { "status": projectStatus } })
		}
		else {
			Swal.fire({
				title: "Error",
				text: "Please Upload a Image...!",
				icon: "error",
				button: "Ok!",
			});
		}
	};

	return (
		<div className="flex">
			<SideDashboard />
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
						</div>
					</div>
					{/* Images */}
					<div className="p-5 bg-white rounded-xl w-10/12 h-[600px] overflow-y-auto">
						<form className="text-center" onSubmit={uploadPhotos}>
							<div className="flex items-center justify-center w-full">
								<label
									htmlFor="dropzone-file"
									className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
								>
									<div className="flex flex-col items-center justify-center pt-5 pb-6">
										<svg
											aria-hidden="true"
											className="w-10 h-10 mb-3 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
											></path>
										</svg>
										<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
											<span className="font-semibold">Click to upload</span> or drag
											and drop
										</p>
									</div>
									<input
										id="dropzone-file"
										type="file"
										multiple
										accept="image/*"
										className="hidden"
										onChange={(e) => {
											handleImages(e);
										}}
									/>
								</label>
							</div>
							{!verify && <span


								className="p-3 bg-gray-800 text-white font-bold mt-5 rounded-lg shadow-lg hover:bg-gray-200 hover:text-gray-800 hover:shadow-2xl disabled "
							>
								Compressing - {compressingLength} / {imagesLength}
							</span>}
							{verify &&


								<button
									type="submit"
									className="p-3 bg-gray-800 text-white font-bold mt-5 rounded-lg shadow-lg hover:bg-gray-200 hover:text-gray-800 hover:shadow-2xl"
								>
									Upload
								</button>}

						</form>
						<div>
							{/* {images.map((img) => {
								console.log(img);
								return <Image src={img} width={200} height={200} alt="/" />;
							})} */}
							{loading &&
								<div className="rounded-xl text-center mt-2">

									<Progress completed={progress} className="rounded-xl" style={{ backgroundColor: "black" }} />
									<h1 className="text-gray-800 mt-2 font-bold">{progress}%</h1>
								</div>

							}
							{showDisks && (
								<div className="flex flex-col justify-center items-center gap-3 my-3">
									<h2 className="text-xl font-bold text-gray-800">Select Disk</h2>
									{diskInfo.map((disk) => {
										console.log(disk);

										return (
											<div className="flex flex-col justify-center items-center p-5 rounded-xl shadow-2xl hover:bg-gray-200 text-gray-800 font-semibold gap-3" onClick={() => selectDisk(disk.mounted)} key={disk.mounted}>
												<h1>{disk.mounted}</h1>

												<h1>
													{disk.capacity}
												</h1>
												<h2>
													Available: {Math.floor(disk.available / 1073741824)}{" "}
													GB
												</h2>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default uploadImages;
