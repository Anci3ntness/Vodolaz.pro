import React from "react"

import classes from "./index.module.scss"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export default function Label({ children, className, ...props }: LabelProps) {
	return (
		<label className={[classes.root, className].join(" ")} {...props}>
			{children}
		</label>
	)
}
