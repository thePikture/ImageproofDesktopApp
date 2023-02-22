import { app, ipcMain, dialog, Notification } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { autoUpdater } from "electron-updater";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
	await app.whenReady();

	const mainWindow = createWindow("main", {
		width: 1920,
		height: 1080,
	});
	mainWindow.maximize();

	autoUpdater.checkForUpdatesAndNotify();

	if (isProd) {
		await mainWindow.loadURL("app://./login.html");
	} else {
		const port = process.argv[2];
		await mainWindow.loadURL(`http://localhost:${port}/login`);
		mainWindow.webContents.openDevTools();
	}
	autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
		const dialogOpts = {
			type: "info",
			buttons: ["OK"],
			title: "Application Updates",
			message: releaseName,
			detail: "A new version is being downloaded",
		};
		dialog.showMessageBox(dialogOpts, (response) => {
			console.log(response);
		});
	});

	autoUpdater.on("download-progress", (progressObj) => {
		mainWindow.webContents.send("download-progress", progressObj.percent);
	});
	autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
		const dialogOpts = {
			type: "info",
			buttons: ["Restart", "Later"],
			title: "Application Updates",
			message: releaseName,
			detail:
				"A new version has been downloaded restart the application to apply the updates",
		};
		dialog.showMessageBox(dialogOpts).then((returnValue) => {
			if (returnValue.response === 0) {
				autoUpdater.quitAndInstall();
			}
		});
	});
	ipcMain.handle("openDirectory", async () => {
		const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
			properties: ["openDirectory"],
		});
		if (canceled) {
			return;
		} else {
			return filePaths[0];
		}
	});
})();

app.on("window-all-closed", () => {
	app.quit();
});
