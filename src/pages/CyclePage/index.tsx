import { observer } from "mobx-react-lite"
import React, { ChangeEvent, useEffect, useState } from "react"

import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import Label from "../../components/common/Label"
import { ClosedLoop } from "../../controllers/vodolaz"
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
		<div className={classes.root}>
			<div className={classes.input_area}>
				<div className={classes.input_place}>
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
				</div>
				<Button
					className={classes.submit}
					onClick={(event) => {
						event.preventDefault()
						if (!!volume && !!pressure && !!difficalty)
							CycleStore.setOutput(
								loop.printTime(volume, pressure, difficalty)
							)
						else {
							window.electron.sendAlert("Заполните все поля")
						}
					}}
					type='submit'
				>
					Вычислить
				</Button>
			</div>
			<div className={classes.output_area}>
				{CycleStore.output.map((e, i) => {
					return (
						<div className={classes["msg-text"]} key={i}>
							{e}
						</div>
					)
				})}
			</div>
		</div>
	)
}
export default observer(CyclePage)
