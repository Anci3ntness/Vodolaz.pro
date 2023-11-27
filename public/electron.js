const { BrowserWindow, app } = require("electron")

const path = require("path")
const isDev = require("electron-is-dev")

function createWindow(id) {
	let win = new BrowserWindow({
		title: "Название приложения",
		width: 1280,
		height: 1024,
		minWidth: 800,
		minHeight: 640,
		resizable: true,
		fullscreenable: true,
		backgroundColor: "#fff",
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			devTools: true,
			enableRemoteModule: true,
		},
	})
	win.removeMenu()

	const urlDom = "http://localhost:8080#"
	const fileDom = `file://${path.join(__dirname, "../build/index.html#")}`

	const appPath = isDev ? urlDom : fileDom

	win.loadURL(appPath)
	if (isDev) {
		win.webContents.openDevTools()
	}
	win.on("closed", () => (win = null))
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
