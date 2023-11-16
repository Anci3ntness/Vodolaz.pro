const { BrowserWindow, app } = require("electron")

function createWindow() {
	const win = new BrowserWindow({
		title: "Название приложения",
		width: 1200,
		height: 900,
		resizable: true,
		fullscreenable: true,
		backgroundColor: "#07f",
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			devTools: true,
			enableRemoteModule: true,
		},
	})
	win.removeMenu()
	win.loadURL("http://localhost:8080")
	win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
