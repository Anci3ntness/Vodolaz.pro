import React, { useEffect } from "react"

import classes from "./index.module.scss"

export default function MainPage() {
	useEffect(() => {
		;(function (d, s, id) {
			const fjs = d.getElementsByTagName(s)[0]
			const js = d.createElement(s) as HTMLScriptElement
			js.id = id
			js.src = "https://weatherwidget.io/js/widget.min.js"
			js.defer = true
			fjs.parentNode && fjs.parentNode.insertBefore(js, fjs)
		})(document, "script", "weatherwidget-io-js")
	}, [])

	return (
		<div className={classes.root}>
			<a
				className='weatherwidget-io'
				href='https://forecast7.com/ru/55d7637d62/moscow/'
				data-label_1='Москва'
				data-label_2='Погода'
				data-mode='Current'
				data-theme='original'
				style={{ pointerEvents: "none" }}
				onClick={(e) => {
					e.preventDefault()
				}}
			>
				<div className={classes.loading}>
					<div className={classes["lds-ring"]}>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			</a>
		</div>
	)
}
