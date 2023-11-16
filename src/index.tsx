import "./styles/global.scss"

import { Fragment, PropsWithChildren } from "react"
import React, { createContext } from "react"
import ReactDOM from "react-dom/client"

import App from "./App"
import indexLayout from "./layouts/indexLayout"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

const BaseLayout = ({ children }: PropsWithChildren) => (
	<Fragment>{children}</Fragment>
)
let Layout = BaseLayout

Layout = indexLayout

export const Context = createContext({})

const context = {}
function AppWithProvider() {
	return (
		<Context.Provider value={context}>
			<Layout>
				<App />
			</Layout>
		</Context.Provider>
	)
}

root.render(<AppWithProvider />)
