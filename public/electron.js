const {
	BrowserWindow,
	app,
	shell,
	ipcMain,
	dialog,
	session,
} = require("electron")

const path = require("path")
const isDev = require("electron-is-dev")
const fs = require("fs")
function createWindow(id) {
	let win = new BrowserWindow({
		title: "Vodolaz.pro",
		width: 1280,
		height: 1024,
		minWidth: 800,
		minHeight: 640,
		resizable: true,
		fullscreenable: true,
		backgroundColor: "#fff",
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			devTools: true,
			enableRemoteModule: true,
			preload: path.join(__dirname, "/preload.js"),
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

	// const filter = {
	// 	urls: ["*://weatherwidget.io/*", "*://api.openai.com/*"],
	// }
	// const corsHeaderValue = isDev
	// 	? "http://localhost:8080"
	// 	: "capacitor-electron://-"

	// session.defaultSession.webRequest.onBeforeSendHeaders(
	// 	filter,
	// 	(details, callback) => {
	// 		details.requestHeaders["Access-Control-Allow-Origin"] = ["*"]
	// 		callback({ requestHeaders: details.requestHeaders })
	// 	}
	// )

	// session.defaultSession.webRequest.onHeadersReceived(
	// 	filter,
	// 	(details, callback) => {
	// 		details.responseHeaders["Access-Control-Allow-Origin"] = ["*"]
	// 		callback({ responseHeaders: details.responseHeaders })
	// 	}
	// )

	win.on("closed", () => (win = null))

	ipcMain.on("send-alert", (event, incomingMessage) => {
		const options = {
			type: "error",
			title: "Предупреждение",
			message: incomingMessage,
			noLink: true,
			buttons: ["Okay"],
		}
		dialog.showMessageBox(win, options)
	})
	ipcMain.on("toMain", (event, args) => {
		const data = args
		win.webContents.send("fromMain", data)
	})
	ipcMain.handle("invokeMain", async (event, args) => {
		const data = fs.readFileSync(path.join(__dirname, "./target.xlsx"))
		return data
	})
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
app.on("web-contents-created", (event, contents) => {
	contents.on("will-navigate", (event, navigationUrl) => {
		const parsedUrl = new URL(navigationUrl)

		if (parsedUrl.origin !== "https://localhost:8080") {
			event.preventDefault()
		}
	})
})
app.on("web-contents-created", (event, contents) => {
	contents.setWindowOpenHandler(({ url }) => {
		const parsedUrl = new URL(url)
		if (parsedUrl.origin !== "https://localhost:8080") {
			setImmediate(() => {
				shell.openExternal(url)
			})
		}

		return { action: "deny" }
	})
})
app.commandLine.appendSwitch("lang", "EN")
