import { PropsWithChildren } from "react"

import NavBar from "../../components/default/NavBar"
import classes from "./index.module.scss"

export default function indexLayout({ children }: PropsWithChildren) {
	return (
		<main className={classes.root}>
			<h1 className={classes.title}>VODOLAZ.PRO</h1>
			<div className={classes.main_wrapper}>
				<NavBar />
				<div className={classes.children}>{children}</div>
			</div>
		</main>
	)
}
