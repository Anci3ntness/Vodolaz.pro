import { observer } from "mobx-react-lite"
import React, { ChangeEvent, useEffect, useState } from "react"

import Input from "../../components/common/Input"
import Label from "../../components/common/Label"
import { useStore } from "../../store/useStore"
import classes from "./index.module.scss"

function SemiCyclePage() {
	const { SemiCycleStore } = useStore()

	const [volume, setVolume] = useState(SemiCycleStore.volume)
	const [density, setDensity] = useState(SemiCycleStore.density)
	const [pressure, setPressure] = useState(SemiCycleStore.pressure)

	function densityHandler(event: ChangeEvent<HTMLInputElement>) {
		setDensity(Number(event.target.value))
	}
	function volumeHandler(event: ChangeEvent<HTMLInputElement>) {
		setVolume(Number(event.target.value))
	}
	function pressureHandler(event: ChangeEvent<HTMLInputElement>) {
		setPressure(Number(event.target.value))
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
	return (
		<div className={classes.root}>
			<div className={classes.input_area}>
				<div className={classes.input_place}>
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
				</div>
			</div>
			<div className={classes.output_area}></div>
		</div>
	)
}
export default observer(SemiCyclePage)
