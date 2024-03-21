import _ from "lodash"
import { observer } from "mobx-react-lite"
import React, { ChangeEvent, useEffect, useState } from "react"

import Input from "../../components/common/Input"
import Label from "../../components/common/Label"
import { SemiClosedLoop, convertToMatrix } from "../../controllers/vodolaz"
import ToolPageLayout from "../../layouts/ToolPageLayout"
import { useStore } from "../../store/useStore"
import msgType from "../../types/output-msg.type"
import eZapas from "../../types/zapas.enum"
import classes from "./index.module.scss"

function SemiCyclePage() {
	const { SemiCycleStore } = useStore()

	const semiLoop = new SemiClosedLoop()

	const [volume, setVolume] = useState(SemiCycleStore.volume!)
	const [density, setDensity] = useState(SemiCycleStore.density!)
	const [pressure, setPressure] = useState(SemiCycleStore.pressure!)
	const [zapas, setZapas] = useState(SemiCycleStore.zapas)

	function densityHandler(event: ChangeEvent<HTMLInputElement>) {
		setDensity(Number(event.target.value))
	}
	function volumeHandler(event: ChangeEvent<HTMLInputElement>) {
		setVolume(Number(event.target.value))
	}
	function pressureHandler(event: ChangeEvent<HTMLInputElement>) {
		setPressure(Number(event.target.value))
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

	async function additionaly(timePlusDepth: number[]): Promise<msgType[]> {
		let output: msgType[] = []
		let flag = true
		let maxDecom = [0]

		const data = await convertToMatrix()
		let vodorod: number = 100 - density
		let normalDepth: number = 0
		for (let datum of data) {
			if (
				timePlusDepth[1] - datum[0] < 3 &&
				timePlusDepth[1] - datum[0] >= 0
			) {
				normalDepth = datum[0]
			}
			if (
				(timePlusDepth[1] * vodorod) / 80 - datum[0] < 3 &&
				(timePlusDepth[1] * vodorod) / 80 - datum[0] >= 0
			) {
				if (datum[1] + datum[2] < timePlusDepth[0]) {
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

		return output
	}

	useEffect(() => {
		SemiCycleStore.setVolume(volume)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [volume])

	useEffect(() => {
		SemiCycleStore.setDensity(density)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [density])

	useEffect(() => {
		SemiCycleStore.setPressure(pressure)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pressure])
	useEffect(() => {
		SemiCycleStore.setZapas(zapas)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [zapas])
	return (
		<ToolPageLayout
			btnOnClick={async (event) => {
				event.preventDefault()
				if (!!volume && !!pressure && !!density && !!zapas[0]) {
					const [semiOutput, numberOutput] =
						semiLoop.printDepthAndTime(
							volume,
							density,
							pressure,
							zapas[0]
						)
					const additionalyOutput = await additionaly(numberOutput)
					const output: msgType[] = _.concat(
						semiOutput,
						additionalyOutput
					)
					if (_.isEqual(output, SemiCycleStore.output)) return
					const msgTextClassArray = Array.from(
						document.getElementsByClassName(classes["msg-text"])
					)
					msgTextClassArray.forEach((e) => {
						e.classList.remove(classes["awake-msg"])
						void e.getBoundingClientRect().width
						e.classList.add(classes["destroy-msg"])
					})
					setTimeout(() => {
						SemiCycleStore.setOutput(output)
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
			output={SemiCycleStore.output.map((e, i) => {
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
			className={classes.root}
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
				<Label>Введите объем НГДС</Label>
				<Input
					after='От 5 до 10 литров'
					type='number'
					min={5}
					max={10}
					value={volume || ""}
					maxLength={2}
					onChange={volumeHandler}
				/>
			</div>
			<div className={classes.input_wrapper}>
				<Label>Укажите содержание кислорода</Label>
				<Input
					after='От 30 до 60 %'
					type='number'
					min={30}
					max={60}
					value={density || ""}
					maxLength={2}
					onChange={densityHandler}
				/>
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
export default observer(SemiCyclePage)
