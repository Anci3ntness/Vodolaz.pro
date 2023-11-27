import React from "react"

import { publicRoutes } from "../../../routes"
import Tab from "../../elements/Tab"
import classes from "./index.module.scss"

export default function NavBar() {
	return (
		<div className={classes.root}>
			{publicRoutes.map((e) => {
				return <Tab key={e.path} title={e.title} route={e.path} />
			})}
		</div>
	)
}
