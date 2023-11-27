import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import classes from "./index.module.scss"

export type tTab = {
	title: string
	route: string
}

export default function Tab({ title, route }: tTab) {
	const [active, setActive] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if (location.pathname === route) {
			setActive(true)
		} else {
			setActive(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location])

	return (
		<div
			className={classes.root}
			style={
				active
					? { borderBottom: 0, backgroundColor: "var(--child-color)" }
					: {}
			}
			onClick={(e) => {
				if (active) return
				navigate(route)
			}}
			title={title}
		>
			<div className={classes.title}>{title}</div>
		</div>
	)
}
