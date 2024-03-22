import _ from "lodash"
import { observer } from "mobx-react-lite"
import React, { ChangeEvent, useEffect, useState } from "react"

import Input from "../../components/common/Input"
import Label from "../../components/common/Label"
import { SemiClosedLoop } from "../../controllers/vodolaz"
import ToolPageLayout from "../../layouts/ToolPageLayout"
import { useStore } from "../../store/useStore"
import { eZapas } from "../../types/enums"
import classes from "./index.module.scss"

function ReverseCyclePage() {
	const { ReverseCycleStore } = useStore()

	const semiLoop = new SemiClosedLoop()

	const [deepness, setDeepness] = useState(ReverseCycleStore.deepness)
	const [duration, setDuration] = useState(ReverseCycleStore.duration)
	const [zapas, setZapas] = useState(ReverseCycleStore.zapas)
	function deepnessHandler(event: ChangeEvent<HTMLInputElement>) {
		setDeepness(Number(event.target.value))
	}
	function durationHandler(event: ChangeEvent<HTMLInputElement>) {
		setDuration(Number(event.target.value))
	}
	function zapasHandler(event: ChangeEvent<HTMLInputElement>) {
		setZapas([Number(event.target.value)])
		// const nw = [...old]
		// 	const value = Number(event.target.value)
		// 	if (_.includes(nw, value)) {
		// 		_.pull(nw, value)
		// 	} else nw.push(value)
		// 	return nw
	}

	useEffect(() => {
		ReverseCycleStore.setDeepness(deepness)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deepness])

	useEffect(() => {
		ReverseCycleStore.setDuration(duration)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [duration])
	useEffect(() => {
		ReverseCycleStore.setZapas(zapas)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [zapas])

	return (
		<ToolPageLayout
			className={classes.root}
			btnOnClick={(event) => {
				event.preventDefault()
				if (!!deepness && !!duration && !!zapas) {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const [output, numberOutput] =
						semiLoop.printValuePercentPressure(
							deepness,
							duration,
							zapas[0]
						)
					if (_.isEqual(numberOutput, [-1, -1])) {
						output.push({
							main: false,
							text: "Нет подходящего снаряжения.",
						})
					}
					if (_.isEqual(output, ReverseCycleStore.output)) return
					const msgTextClassArray = Array.from(
						document.getElementsByClassName(classes["msg-text"])
					)
					msgTextClassArray.forEach((e) => {
						e.classList.remove(classes["awake-msg"])
						void e.getBoundingClientRect().width
						e.classList.add(classes["destroy-msg"])
					})
					setTimeout(() => {
						ReverseCycleStore.setOutput(output)
						msgTextClassArray.forEach((e) => {
							e.classList.remove(classes["destroy-msg"])
							void e.getBoundingClientRect().width
							e.classList.add(classes["awake-msg"])
						})
					}, 100)
				} else {
					window.electron.sendAlert("Заполните все поля")
				}
			}}
			output={ReverseCycleStore.output.map((e, i) => {
				return (
					<div
						className={[
							e.main ? classes["main-msg-text"] : "",
							classes["msg-text"],
							classes["awake-msg"],
						].join(" ")}
						key={i}
					>
						{e.text}
					</div>
				)
			})}
			semiChildren={
				<div className={classes.input_wrapper}>
					<Label>Запас ДГС</Label>
					<div className={classes.checkbox_wrapper}>
						<Input
							type='checkbox'
							text='30%'
							value={eZapas["30%"]}
							onChange={zapasHandler}
							checkValue={zapas}
						/>
						<Input
							type='checkbox'
							text='20%'
							value={eZapas["20%"]}
							onChange={zapasHandler}
							checkValue={zapas}
						/>
					</div>
				</div>
			}
		>
			<div className={classes.input_wrapper}>
				<Label>Укажите длительность погружения в минутах</Label>
				<Input
					after='От 30 до 420 минут'
					type='number'
					min={30}
					max={420}
					value={duration || ""}
					maxLength={3}
					onChange={durationHandler}
				/>
			</div>
			<div className={classes.input_wrapper}>
				<Label>Укажите глубину погружения в метрах</Label>
				<Input
					after='От 2 до 50 метров'
					type='number'
					min={2}
					max={50}
					value={deepness || ""}
					maxLength={2}
					onChange={deepnessHandler}
				/>
			</div>
		</ToolPageLayout>
	)
}
export default observer(ReverseCyclePage)
