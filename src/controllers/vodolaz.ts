class ClosedLoop {
	private EASY: string = "easy"
	private NORMAL: string = "normal"
	private HARD: string = "hard"
	printTime(
		balloonVolume: number,
		pressure: number,
		difficulty: string
	): void {
		let timeInMinute: number = pressure * balloonVolume * 0.7
		if (difficulty === this.EASY) {
			let a: number = Math.floor(timeInMinute / 30)
			a = a * 8
			timeInMinute -= a
		}
		if (difficulty === this.NORMAL) {
			timeInMinute = timeInMinute / 1.5
			let a: number = Math.floor(timeInMinute / 20)
			a = a * 8
			timeInMinute -= a
		}
		if (difficulty === this.HARD) {
			timeInMinute = timeInMinute / 2
			let a: number = Math.floor(timeInMinute / 10)
			a = a * 8
			timeInMinute -= a
		}
		console.log(
			`Расчетное время экспозиции на грунте в минутах: ${timeInMinute.toFixed(
				2
			)}`
		)
		console.log(`В часах: ${(timeInMinute / 60).toFixed(2)}`)
	}

	printVolumePlusPressure(time: number, difficulty: string): void {
		let doubleTime: number = 0
		let flag: boolean
		let hasBalon: boolean = false
		if (difficulty === this.EASY) {
			let a: number = Math.floor(time / 20)
			a = a * 8
			time += a
			doubleTime = time * 1.5
		}
		if (difficulty === this.NORMAL) {
			let a: number = Math.floor(time / 20)
			a = a * 8
			time += a
			doubleTime = time * 2
		}

		for (let balloonVolume = 0; balloonVolume < 2; balloonVolume++) {
			flag = false
			for (let pressure = 200; pressure < 300; pressure++) {
				if (doubleTime <= pressure * balloonVolume * 0.7 && !flag) {
					flag = true
					hasBalon = true
					console.log(
						`Нужен баллон объемом ${balloonVolume} литров и с давлением не меньше ${pressure} паскаль.`
					)
				}
			}
		}
		if (!hasBalon) console.log("Нет подходящего снаряжения.")
	}
}
class SemiClosedLoop {
	printDepthAndTime(
		value: number,
		fullPercent: number,
		pressure: number
	): number[] {
		const percent: number = fullPercent / 100
		let timeInMinute: number = pressure * value * 0.7
		timeInMinute = timeInMinute / (3 / percent)
		console.log(
			`Расчетное время экспозиции на грунте в минутах: ${timeInMinute.toFixed(
				2
			)}, в часах: ${timeInMinute / 60}`
		)
		const depthSport: number = (1.6 / percent) * 10 - 10
		const depthNATO: number = (2.4 / percent) * 10 - 10
		const depthRF: number = (3.2 / percent) * 10 - 10
		console.log(`Глубина погружения для спортсменов: ${depthSport}у`)
		console.log(`Глубина погружения для военных НАТО: ${depthNATO}`)
		console.log(`Глубина погружения для военных РФ: ${depthRF}`)
		return [timeInMinute, depthSport]
	}

	printValuePercentPressure(depth: number, timeInMinute: number): number[] {
		let flag: boolean = false
		let coefficient: number
		if (depth < 17) {
			coefficient = 1.6
		} else if (depth <= 30) {
			coefficient = 2
		} else {
			coefficient = 3.2
		}
		let percent: number = (coefficient * 10) / (depth + 10)
		if (percent < 0.4) {
			return [-1, -1, -1]
		}

		const valuePressure: number = (timeInMinute * 3) / (percent * 0.7)
		let value: number = 0
		let pressure: number = 0
		console.log("Для полу-замкнутого цикла")
		for (let i = 5; i <= 10; i++) {
			value = i
			pressure = valuePressure / value
			if (pressure > 170 && pressure < 330) {
				console.log(
					`Для баллона в ${value.toFixed(
						2
					)} литров давление составит в ${pressure.toFixed(
						2
					)} паскаль`
				)
				flag = true
			}
		}
		if (!flag) {
			pressure = -1
			percent = -1
		}
		return [percent, pressure]
	}
}

export { ClosedLoop, SemiClosedLoop }
