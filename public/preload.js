const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
	sendAlert: (message) => ipcRenderer.send("send-alert", message),
	require: (callback) => window.require(callback),
	send: (channel, data) => {
		// whitelist channels
		let validChannels = ["toMain"]
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data)
		}
	},
	receive: (channel, func) => {
		let validChannels = ["fromMain"]
		if (validChannels.includes(channel)) {
			// Deliberately strip event as it includes `sender`
			ipcRenderer.on(channel, (event, ...args) => func(...args))
		}
	},
	invoke: (channel, args) => {
		let validChannels = ["invokeMain", "invokeAi"]
		if (validChannels.includes(channel)) {
			return ipcRenderer.invoke(channel, args)
		}
	},
})
