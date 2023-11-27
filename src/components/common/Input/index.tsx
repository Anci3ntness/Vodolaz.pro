import React from "react"

import classes from "./index.module.scss"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	text?: string
	checkValue?: any
	after?: string
}

export default function Input({
	text,
	checkValue,
	className,
	type,
	onChange,
	onBlur,
	after,
	...props
}: InputProps) {
	function renderSwitch(type: string | undefined) {
		switch (type) {
			case "radio":
				return (
					<label className={classes.radio_label}>
						<input
							type='radio'
							className={classes.radio}
							checked={checkValue === props.value}
							onChange={onChange}
							onBlur={onBlur}
							{...props}
						/>
						<div className={classes.custom_button}>{text}</div>
					</label>
				)
			case "number":
				function validationNumber(value: string) {
					let num = value?.replace(/\D/g, "")
					if (num.length > Number(props?.maxLength))
						num = num.slice(0, props.maxLength)
					return num
				}
				return (
					<input
						className={classes.input}
						onChange={(event) => {
							event.target.value = validationNumber(
								event.target.value
							)
							if (!!onChange) onChange(event)
						}}
						onBlur={(event) => {
							if (!!props?.min || !!props?.max) {
								const num = event.target.value
								if (Number(num) < Number(props?.min))
									event.target.value = String(props?.min)
								if (Number(num) > Number(props?.max))
									event.target.value = String(props?.max)
								if (!!onChange) onChange(event)
							}
							if (!!onBlur) onBlur(event)
						}}
						{...props}
					/>
				)

			default:
				return (
					<input
						className={classes.input}
						onChange={onChange}
						onBlur={onBlur}
						{...props}
					/>
				)
		}
	}
	return (
		<span
			className={[classes.root, !!after && classes.after, className].join(
				" "
			)}
			data-after={after || ""}
		>
			{renderSwitch(type)}
		</span>
	)
}
