import _ from "lodash"
import { observer } from "mobx-react-lite"
import React, { ChangeEvent, useEffect, useState } from "react"

import Input from "../../components/common/Input"
import Label from "../../components/common/Label"
import {
	ClosedLoop,
	SemiClosedLoop,
	convertToMatrix,
} from "../../controllers/vodolaz"
import ToolPageLayout from "../../layouts/ToolPageLayout"
import { useStore } from "../../store/useStore"
import { eWeatherConditions, eZapas } from "../../types/enums"
import msgType from "../../types/output-msg.type"
import classes from "./index.module.scss"

function DGSCyclePage() {
	const { DGSCycleStore } = useStore()

	const loop = new ClosedLoop()
	const semiLoop = new SemiClosedLoop()

	const [difficalty, setDifficalty] = useState(DGSCycleStore.difficalty)
	const [deepness, setDeepness] = useState(DGSCycleStore.deepness!)
	const [duration, setDuration] = useState(DGSCycleStore.duration!)
	const [zapas, setZapas] = useState(DGSCycleStore.zapas)
	const [weatherConditions, setWeatherConditions] = useState(
		DGSCycleStore.weatherConditions
	)

	function difficaltyHandler(event: ChangeEvent<HTMLInputElement>) {
		setDifficalty(event.target.value)
	}
	function deepnessHandler(event: ChangeEvent<HTMLInputElement>) {
		setDeepness(Number(event.target.value))
	}
	function durationHandler(event: ChangeEvent<HTMLInputElement>) {
		setDuration(Number(event.target.value))
	}
	function zapasHandler(event: ChangeEvent<HTMLInputElement>) {
		setZapas([Number(event.target.value)])
	}
	function weatherConditionsHandler(event: ChangeEvent<HTMLInputElement>) {
		setWeatherConditions((old) => {
			const nw = [...old]
			const value = event.target.value
			if (_.includes(nw, value)) {
				_.pull(nw, value)
			} else nw.push(value)
			return nw
		})
	}
	function checkWeatherConditions(arr: string[]) {
		if (
			_.includes(arr, eWeatherConditions.course) ||
			_.includes(arr, eWeatherConditions.danger)
		) {
			return 0.15
		}
		if (
			_.includes(arr, eWeatherConditions.cold) ||
			_.includes(arr, eWeatherConditions.radiation)
		) {
			return 0.1
		}
		return 0
	}

	async function additionaly(percentPressure: number[]): Promise<msgType[]> {
		let output: msgType[] = []
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
			output.push({
				main: true,
				text: "Учитывая декомпрессионные обязательства",
			})
			if (maxDecom[0] === 0) {
				output.push({
					main: false,
					text: "Для заданной системы декомпрессионные обязательства не нужны.",
				})
			} else {
				output.push({
					main: false,
					text:
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
						" мин.\n",
				})
			}
			output.push({
				main: false,
				text:
					"Процент содержания кислорода смеси " +
					(percentPressure[0] * 62.5).toFixed(2),
			})
		} else {
			output.push({ main: false, text: "Нет подходящего снаряжения." })
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
	useEffect(() => {
		DGSCycleStore.setZapas(zapas)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [zapas])
	useEffect(() => {
		DGSCycleStore.setWeatherConditions(weatherConditions)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherConditions])

	return (
		<ToolPageLayout
			btnOnClick={async (event) => {
				event.preventDefault()
				if (!!deepness && !!duration && !!difficalty && !!zapas) {
					const loopOutput = loop.printVolumePlusPressureOutput(
						duration,
						difficalty,
						zapas[0]
					)

					const [semiOutput, semiNumberOutput] =
						semiLoop.printValuePercentPressureOutput(
							deepness,
							duration,
							zapas[0],
							checkWeatherConditions(weatherConditions)
						)
					const additionalyOutput = await additionaly(
						semiNumberOutput
					)
					const output: msgType[] = _.concat(
						[
							{
								main: true,
								text:
									"Маркеры опасности увеличили расход смеси на: " +
									checkWeatherConditions(weatherConditions) *
										100 +
									"%",
							},
						],
						semiOutput,
						additionalyOutput,
						loopOutput
					)
					if (_.isEqual(output, DGSCycleStore.output)) return
					const msgTextClassArray = Array.from(
						document.getElementsByClassName(classes["msg-text"])
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
			className={classes.root}
			output={DGSCycleStore.output.map((e, i) => {
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
				<>
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
					<div className={classes.input_wrapper}>
						<Label>Выбор маркеров опасности</Label>
						<div
							className={classes.checkbox_wrapper}
							style={{ flexDirection: "column" }}
						>
							<Input
								type='checkbox'
								text='Холодная вода'
								value={eWeatherConditions.cold}
								onChange={weatherConditionsHandler}
								checkValue={weatherConditions}
							/>
							<Input
								type='checkbox'
								text='Опасные предметы'
								value={eWeatherConditions.danger}
								onChange={weatherConditionsHandler}
								checkValue={weatherConditions}
							/>
							<Input
								type='checkbox'
								text='Химическое загрязнение'
								value={eWeatherConditions.radiation}
								onChange={weatherConditionsHandler}
								checkValue={weatherConditions}
							/>
							<Input
								type='checkbox'
								text='Течение'
								value={eWeatherConditions.course}
								onChange={weatherConditionsHandler}
								checkValue={weatherConditions}
							/>
						</div>
					</div>
				</>
			}
		>
			<div className={classes.input_wrapper}>
				<Label>Укажите рабочую глубину</Label>
				<Input
					after='От 12 до 60 метров'
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
		</ToolPageLayout>
	)
}
export default observer(DGSCyclePage)
