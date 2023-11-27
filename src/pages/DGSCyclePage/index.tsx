import { observer } from "mobx-react-lite"
import React, { ChangeEvent, useEffect, useState } from "react"

import Input from "../../components/common/Input"
import Label from "../../components/common/Label"
import { useStore } from "../../store/useStore"
import classes from "./index.module.scss"

function DGSCyclePage() {
	const { DGSCycleStore } = useStore()

	const [difficalty, setDifficalty] = useState(DGSCycleStore.difficalty)
	const [deepness, setDeepness] = useState(DGSCycleStore.deepness)
	const [duration, setDuration] = useState(DGSCycleStore.duration)

	function difficaltyHandler(event: ChangeEvent<HTMLInputElement>) {
		setDifficalty(event.target.value)
	}
	function deepnessHandler(event: ChangeEvent<HTMLInputElement>) {
		setDeepness(Number(event.target.value))
	}
	function durationHandler(event: ChangeEvent<HTMLInputElement>) {
		setDuration(Number(event.target.value))
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
			</div>
			<div className={classes.output_area}></div>
		</div>
	)
}
export default observer(DGSCyclePage)
