import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import logo from "../public/images/imgproof.png";
import leftImg from "../public/images/pexels-andre-furtado-1264210.jpg"
import electron from "electron";
import getMAC from "getmac";
import axios from "axios";
import { RiEyeCloseLine } from "react-icons/ri";
import { MdRemoveRedEye } from "react-icons/md";
import { useRouter } from "next/router";
import Progress from 'react-progressbar';

import Swal from "sweetalert2";



function Home() {
	const [macId, setMacId] = useState("");
	const [error, setError] = useState(false);
	const [showPassword, setShowPassword] = useState(true);
	const [percent, setPercent] = useState(0)

	const emailRef = useRef("");
	const passwordRef = useRef("");
	const rememberRef = useRef("")

	let log = require('electron-log')

	useEffect(() => {
		if (typeof window !== "undefined") {
			let data = getMAC();
			console.log({ data });
			setMacId(data);
			const checked = localStorage.getItem("checked")
			if (checked) {
				router.push("/dashboard");

			}
		}
	}, []);

	const ipcRenderer = electron.ipcRenderer || false;
	const shell = electron.shell;
	const router = useRouter();

	if (ipcRenderer) {
		ipcRenderer.on('download-progress', (event, text) => {
			// progressBar.style.width = `${text}%`
			setPercent(Math.round(text))
		})
	}



	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(rememberRef.current.checked);
		const d = {
			email: emailRef.current.value,
			password: passwordRef.current.value,
			macId: macId,
		};
		console.log(d);
		log.info(d)
		localStorage.setItem("email", emailRef.current.value)

		try {
			const { data } = await axios.post(`${process.env.DOMAIN_NAME}/api/login`, d);
			console.log(data);
			const photographer = JSON.stringify(data.photographer);
			if (data.success) {
				log.info(`User Detail: ${photographer}`);

				// setLoading(false);
				Swal.fire({
					title: "Success",
					text: data.msg,
					button: "Ok",
					icon: "success",
				});
				// navigate("/adminDashboard");
				localStorage.setItem("token", data.token);
				if (rememberRef.current.checked) {
					localStorage.setItem("checked", rememberRef.current.checked)
				}
				localStorage.setItem("user", photographer);
				router.push("/dashboard");
				// showNotification();
			} else {
				const da = JSON.stringify(d);
				log.error(`${data.msg}`);
				log.error(`${da}`);
				// setLoading(false);

				if (!data.subcription) {
					Swal.fire({
						title: "Error",
						text: data.msg,
						icon: "error",
						button: "Ok!",
					});
					setTimeout(() => {
						shell.openExternal("https://imageproof.ai/");
					}, 3000);
				} else {
					Swal.fire({
						title: "Error",
						text: data.msg,
						icon: "error",
						button: "Ok!",
					});
				}
			}
		} catch (error) {
			console.log(error);
			log.error(`${error}`);
		}
	};


	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<div className="flex h-screen overflow-hidden">
				<div className="w-4/6">
					<Image src={leftImg} alt="l" height={4100} />
				</div>
				<div className=" bg-white h-full p-10 flex flex-col justify-center w-2/6">
					<div >
						<div className="text-center">
							<Image src={logo} alt="logo" height={60} width={200} />
						</div>
						<form className="flex flex-col mt-5" onSubmit={handleSubmit}>
							<input
								type="email"
								id="email"
								required
								className="border-black-600 border-2 rounded mb-2 p-3 w-full outline-none"
								placeholder="Email"
								autoComplete="off"
								ref={emailRef}
							/>
							<div className="relative">
								<input
									type={showPassword ? "password" : "text"}
									id="password"
									required
									className="border-black-600 border-2 rounded mb-2 w-full p-3 outline-none "
									placeholder="Password"
									autoComplete="off"
									ref={passwordRef}
								/>
								{showPassword ? (
									<RiEyeCloseLine
										className="absolute top-5 right-5 cursor-pointer"
										onClick={handleShowPassword}
									/>
								) : (
									<MdRemoveRedEye
										className="absolute top-5 right-5 cursor-pointer"
										onClick={handleShowPassword}
									/>
								)}
							</div>
							<div className="text-right" onClick={() => {
								shell.openExternal("https://imageproof.ai/reset-pass");
							}}>

								<h1

									className="text-gray-400 text-right hover:text-black cursor-pointer text-md font-bold "
								>
									Forgot password
								</h1>
							</div>
							<div>

								<button
									type="submit"
									className="rounded text-white bg-black w-full h-10 mt-2 hover:bg-gray-400 cursor-pointer text-xl font-bold"
								>
									Login
								</button>
								<div className="py-4 flex gap-2 items-center justify-start w-full">

									<input type='checkbox' id='remember' ref={rememberRef} />
									<label htmlFor="remember" className="text-md">Remember me</label>
								</div>
							</div>
							<div className="text-right">

								<p className="mt-4 text-md">
									Didn't have an account?{" "}
									<a
										onClick={() => {
											shell.openExternal("https://imageproof.ai/signup");
										}}
										className="text-gray-400  hover:text-black cursor-pointer text-md font-bold"
									>
										Register
									</a>
								</p>
							</div>
						</form>
					</div>
					{percent > 0 && <div className="rounded-xl text-center mt-2">
						<h1 className="text-gray-800 mt-2 font-bold">Downloading update Please wait ...</h1>

						<Progress completed={percent} className="rounded-xl" style={{ backgroundColor: "black" }} />
						<h1 className="text-gray-800 mt-2 font-bold">{percent}%</h1>
					</div>}
				</div>

			</div>
		</>
	);
}

export default Home;
