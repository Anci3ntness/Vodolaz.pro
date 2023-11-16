import { PropsWithChildren } from "react"

import classes from "./index.module.scss"

export default function indexLayout({ children }: PropsWithChildren) {
	return (
		<div className={classes.root}>
			<h1 className={classes.title}>Название проги</h1>
		</div>
	)
}
