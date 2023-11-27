import { observer } from "mobx-react-lite"
import React, { ChangeEvent, useEffect, useState } from "react"

import Input from "../../components/common/Input"
import Label from "../../components/common/Label"
import { useStore } from "../../store/useStore"
import classes from "./index.module.scss"

function ReverseCyclePage() {
	const { ReverseCycleStore } = useStore()

	const [deepness, setDeepness] = useState(ReverseCycleStore.deepness)
	const [duration, setDuration] = useState(ReverseCycleStore.duration)

	function deepnessHandler(event: ChangeEvent<HTMLInputElement>) {
		setDeepness(Number(event.target.value))
	}
	function durationHandler(event: ChangeEvent<HTMLInputElement>) {
		setDuration(Number(event.target.value))
	}

	useEffect(() => {
		ReverseCycleStore.setDeepness(deepness)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deepness])

	useEffect(() => {
		ReverseCycleStore.setDuration(duration)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [duration])

	return (
		<div className={classes.root}>
			<div className={classes.input_area}>
				<div className={classes.input_place}>
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
				</div>
			</div>
			<div className={classes.output_area}></div>
		</div>
	)
}
export default observer(ReverseCyclePage)
