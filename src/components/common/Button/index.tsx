import React from "react"

import classes from "./index.module.scss"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: string
}

export default function Button({
	children,
	className,
	onClick,
	...props
}: ButtonProps) {
	return (
		<button
			className={[classes.root, className].join(" ")}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	)
}
