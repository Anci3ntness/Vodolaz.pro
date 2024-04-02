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
			fjs?.parentNode && fjs.parentNode.insertBefore(js, fjs)
		})(document, "script", "weatherwidget-io-js")
	}, [])

	return (
		<div className={classes.root}>
			<div className={classes.divider}></div>
			<a
				className={[classes.widget, "weatherwidget-io"].join(" ")}
				href='https://forecast7.com/ru/55d7637d62/moscow/'
				data-label_1='Москва'
				data-label_2='Погода'
				data-mode='Current'
				data-theme='original'
				data-basecolor='#325d90'
				style={{
					pointerEvents: "none",
					width: "100%",
				}}
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
			<div className={classes.main_content}>
				<h1>
					Подбери дыхательно газовую смесь для заданных глубины и
					времени на грунте
				</h1>
				<h2>Наш чат бот поможет ответить тебе на вопросы</h2>
			</div>
		</div>
	)
}
