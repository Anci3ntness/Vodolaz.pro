import _ from "lodash"
import { observer } from "mobx-react-lite"
import React, { ChangeEvent, useEffect, useState } from "react"

import Input from "../../components/common/Input"
import Label from "../../components/common/Label"
import { ClosedLoop } from "../../controllers/vodolaz"
import ToolPageLayout from "../../layouts/ToolPageLayout"
import { useStore } from "../../store/useStore"
import classes from "./index.module.scss"

function CyclePage() {
	const { CycleStore } = useStore()

	const loop = new ClosedLoop()

	const [difficalty, setDifficalty] = useState(CycleStore.difficalty)
	const [volume, setVolume] = useState(CycleStore.volume)
	const [pressure, setPressure] = useState(CycleStore.pressure)

	function difficaltyHandler(event: ChangeEvent<HTMLInputElement>) {
		setDifficalty(event.target.value)
	}
	function volumeHandler(event: ChangeEvent<HTMLInputElement>) {
		setVolume(Number(event.target.value))
	}
	function pressureHandler(event: ChangeEvent<HTMLInputElement>) {
		setPressure(Number(event.target.value))
	}

	useEffect(() => {
		CycleStore.setDifficalty(difficalty)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [difficalty])

	useEffect(() => {
		CycleStore.setVolume(volume)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [volume])

	useEffect(() => {
		CycleStore.setPressure(pressure)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pressure])

	return (
		<ToolPageLayout
			className={classes.root}
			btnOnClick={(event) => {
				event.preventDefault()
				if (!!volume && !!pressure && !!difficalty) {
					const output = loop.printTime(volume, pressure, difficalty)

					if (_.isEqual(output, CycleStore.output)) return
					const msgTextClassArray = Array.from(
						document.getElementsByClassName(classes["msg-text"])
					)
					msgTextClassArray.forEach((e) => {
						e.classList.remove(classes["awake-msg"])
						void e.getBoundingClientRect().width
						e.classList.add(classes["destroy-msg"])
					})
					setTimeout(() => {
						CycleStore.setOutput(output)
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
			output={CycleStore.output.map((e, i) => {
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
		>
			<div className={classes.input_wrapper}>
				<Label>Выберите сложность погружения</Label>
				<div className={classes.radio_wrapper}>
					<Input
						type='radio'
						value='easy'
						text='Легкое'
						onChange={difficaltyHandler}
						checkValue={difficalty}
					/>
					<Input
						type='radio'
						value='normal'
						text='Среднее'
						onChange={difficaltyHandler}
						checkValue={difficalty}
					/>
					<Input
						type='radio'
						value='hard'
						text='Тяжелое'
						onChange={difficaltyHandler}
						checkValue={difficalty}
					/>
				</div>
			</div>
			<div className={classes.input_wrapper}>
				<Label>Выберите объем НДГС</Label>
				<div className={classes.radio_wrapper}>
					<Input
						type='radio'
						value={1}
						text='1'
						onChange={volumeHandler}
						checkValue={volume}
					/>
					<Input
						type='radio'
						value={2}
						text='2'
						onChange={volumeHandler}
						checkValue={volume}
					/>
				</div>
			</div>
			<div className={classes.input_wrapper}>
				<Label>Укажите давление ДГС</Label>
				<Input
					after='От 200 до 300 паскалей'
					type='number'
					min={200}
					max={300}
					value={pressure || ""}
					maxLength={3}
					onChange={pressureHandler}
				/>
			</div>
		</ToolPageLayout>
	)
}
export default observer(CyclePage)
