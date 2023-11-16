import { HashRouter } from "react-router-dom"

import AppRouter from "./components/default/AppRouter"
import NavBar from "./components/default/NavBar"

function App() {
	return (
		<HashRouter>
			<NavBar />
			<AppRouter />
		</HashRouter>
	)
}

export default App
