import { Fragment, PropsWithChildren } from "react"
import { HashRouter } from "react-router-dom"

import AppRouter from "./components/default/AppRouter"
import indexLayout from "./layouts/indexLayout"

function App() {
	const BaseLayout = ({ children }: PropsWithChildren) => (
		<Fragment>{children}</Fragment>
	)
	let Layout = BaseLayout

	Layout = indexLayout

	return (
		<HashRouter>
			<Layout>
				<AppRouter />
			</Layout>
		</HashRouter>
	)
}

export default App
