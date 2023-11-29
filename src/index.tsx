import "./styles/global.scss"

import ReactDOM from "react-dom/client"

import App from "./App"
import store, { StoreContext } from "./store/useStore"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
declare global {
	interface Window {
		electron: any
	}
}
function AppWithProvider() {
	return (
		<StoreContext.Provider value={store}>
			<App />
		</StoreContext.Provider>
	)
}

root.render(<AppWithProvider />)
