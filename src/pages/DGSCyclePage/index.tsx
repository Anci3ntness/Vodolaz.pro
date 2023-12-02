import _ from "lodash"
import { observer } from "mobx-react-lite"
import React, { ChangeEvent, useEffect, useState } from "react"

import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import Label from "../../components/common/Label"
import {
	ClosedLoop,
	SemiClosedLoop,
	convertToMatrix,
} from "../../controllers/vodolaz"
import { useStore } from "../../store/useStore"
import classes from "./index.module.scss"

function DGSCyclePage() {
	const { DGSCycleStore } = useStore()

	const loop = new ClosedLoop()
	const semiLoop = new SemiClosedLoop()

	const [difficalty, setDifficalty] = useState(DGSCycleStore.difficalty)
	const [deepness, setDeepness] = useState(DGSCycleStore.deepness!)
	const [duration, setDuration] = useState(DGSCycleStore.duration!)

	function difficaltyHandler(event: ChangeEvent<HTMLInputElement>) {
		setDifficalty(event.target.value)
	}
	function deepnessHandler(event: ChangeEvent<HTMLInputElement>) {
		setDeepness(Number(event.target.value))
	}
	function durationHandler(event: ChangeEvent<HTMLInputElement>) {
		setDuration(Number(event.target.value))
	}

	async function additionaly(percentPressure: number[]): Promise<string[]> {
		let output: string[] = []
		let flag = true
		let maxDecom = [0]
		if (!_.isEqual(percentPressure, [-1, -1])) {
			const data = await convertToMatrix()
			let vodorod = 100 - percentPressure[0]
			let normalDepth = 0
			for (let datum of data) {
				if (deepness - datum[0] < 3 && deepness - datum[0] >= 0) {
					normalDepth = datum[0]
				}
				if (
					(deepness * vodorod) / 80 - datum[0] < 3 &&
					(deepness * vodorod) / 80 - datum[0] >= 0
				) {
					if (datum[1] + datum[2] < duration) {
						if (flag) {
							maxDecom = [datum[0], datum[1], datum[2]]
							flag = false
						} else if (
							datum[1] + datum[2] >
							maxDecom[1] + maxDecom[2]
						) {
							maxDecom = [datum[0], datum[1], datum[2]]
						}
					}
				}
			}
			output.push("Учитывая декомпрессионные обязательства: ")
			if (maxDecom[0] === 0) {
				output.push(
					"Для заданной системы декомпрессионные обязательства не нужны."
				)
			} else {
				output.push(
					"Глубина спуска: " +
						normalDepth +
						" м., " +
						"эквивалент глубины: " +
						maxDecom[0] +
						" м.(воздух).\n" +
						"Экспозиция на грунте: " +
						maxDecom[1] +
						" мин.\n" +
						"Общее время декомпрессии: " +
						maxDecom[2] +
						" мин.\n"
				)
			}
			output.push(
				"Процент содержания кислорода смеси " +
					(percentPressure[0] * 100).toFixed(2)
			)
		} else {
			output.push("Нет подходящего снаряжения.")
		}

		return output
	}

	useEffect(() => {
		DGSCycleStore.setDifficalty(difficalty)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [difficalty])

	useEffect(() => {
		DGSCycleStore.setDeepness(deepness)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deepness])

	useEffect(() => {
		DGSCycleStore.setDuration(duration)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [duration])

	return (
		<div className={classes.root}>
			<div className={classes.input_area}>
				<div className={classes.input_place}>
					<div className={classes.input_wrapper}>
						<Label>Укажите рабочую глубину</Label>
						<Input
							after='От 12 до 60 паскалей'
							type='number'
							min={12}
							max={60}
							value={deepness || ""}
							maxLength={2}
							onChange={deepnessHandler}
						/>
					</div>

					<div className={classes.input_wrapper}>
						<Label>Укажите время работы на грунте</Label>
						<Input
							after='От 30 до 360 минут'
							type='number'
							min={30}
							max={360}
							value={duration || ""}
							maxLength={3}
							onChange={durationHandler}
						/>
					</div>
					<div className={classes.input_wrapper}>
						<Label>Выберите сложность погружения</Label>
						<div className={classes.radio_wrapper}>
							<Input
								type='radio'
								value='normal'
								text='Нормальное'
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
				</div>
				<Button
					className={classes.submit}
					onClick={async (event) => {
						event.preventDefault()
						if (!!deepness && !!duration && !!difficalty) {
							const loopOutput = loop.printVolumePlusPressure(
								duration,
								difficalty
							)

							const [semiOutput, semiNumberOutput] =
								semiLoop.printValuePercentPressure(
									deepness,
									duration
								)
							const additionalyOutput = await additionaly(
								semiNumberOutput
							)
							const output: string[] = _.concat(
								semiOutput,
								additionalyOutput,
								loopOutput
							)
							if (_.isEqual(output, DGSCycleStore.output)) return
							const msgTextClassArray = Array.from(
								document.getElementsByClassName(
									classes["msg-text"]
								)
							)
							msgTextClassArray.forEach((e) => {
								e.classList.remove(classes["awake-msg"])
								void e.getBoundingClientRect().width
								e.classList.add(classes["destroy-msg"])
							})
							setTimeout(() => {
								DGSCycleStore.setOutput(output)
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
					type='submit'
				>
					Вычислить
				</Button>
			</div>
			<div className={classes.output_area}>
				{DGSCycleStore.output.map((e, i) => {
					return (
						<div
							className={[
								classes["msg-text"],
								classes["awake-msg"],
							].join(" ")}
							key={i}
						>
							{e}
						</div>
					)
				})}
			</div>
		</div>
	)
}
export default observer(DGSCyclePage)
