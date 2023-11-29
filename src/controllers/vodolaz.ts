import * as XLSX from "xlsx"

class ClosedLoop {
	private EASY: string = "easy"
	private NORMAL: string = "normal"
	private HARD: string = "hard"
	printTime(
		balloonVolume: number,
		pressure: number,
		difficulty: string
	): string[] {
		let timeInMinute: number = pressure * balloonVolume * 0.7
		let output: string[] = []
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
		output.push(
			`Расчетное время экспозиции на грунте в минутах: ${timeInMinute.toFixed(
				2
			)}`
		)
		output.push(`В часах: ${(timeInMinute / 60).toFixed(2)}`)
		return output
	}

	printVolumePlusPressure(time: number, difficulty: string): string[] {
		let doubleTime: number = 0
		let flag: boolean
		let hasBalon: boolean = false
		let output: string[] = []

		if (difficulty === this.NORMAL) {
			let a: number = Math.floor(time / 20)
			a = a * 8
			time += a
			doubleTime = time * 1.5
		}
		if (difficulty === this.HARD) {
			let a: number = Math.floor(time / 20)
			a = a * 8
			time += a
			doubleTime = time * 2
		}
		output.push("Для замкнутого цикла")
		for (let balloonVolume = 0; balloonVolume < 2; balloonVolume++) {
			flag = false
			for (let pressure = 200; pressure < 300; pressure++) {
				if (doubleTime <= pressure * balloonVolume * 0.7 && !flag) {
					flag = true
					hasBalon = true
					output.push(
						`Нужен баллон объемом ${balloonVolume} литров и с давлением не меньше ${pressure} паскаль.`
					)
				}
			}
		}
		if (!hasBalon) output.push("Нет подходящего снаряжения.")
		return output
	}
}
class SemiClosedLoop {
	printDepthAndTime(
		value: number,
		fullPercent: number,
		pressure: number
	): [string[], number[]] {
		let output: string[] = []
		const percent: number = fullPercent / 100
		let timeInMinute: number = pressure * value * 0.7
		timeInMinute = timeInMinute / (3 / percent)
		output.push(
			`Расчетное время экспозиции на грунте в минутах: ${timeInMinute.toFixed(
				2
			)}, в часах: ${(timeInMinute / 60).toFixed(2)}`
		)
		const depthSport: number = (1.6 / percent) * 10 - 10
		const depthNATO: number = (2.4 / percent) * 10 - 10
		const depthRF: number = (3.2 / percent) * 10 - 10
		output.push(
			`Глубина погружения для спортсменов: ${depthSport.toFixed(2)}у`
		)
		output.push(
			`Глубина погружения для военных НАТО: ${depthNATO.toFixed(2)}`
		)
		output.push(`Глубина погружения для военных РФ: ${depthRF.toFixed(2)}`)
		const numberOutput = [timeInMinute, depthSport]
		return [output, numberOutput]
	}

	printValuePercentPressure(
		depth: number,
		timeInMinute: number
	): [string[], number[]] {
		let flag: boolean = false
		let coefficient: number
		let output: string[] = []
		if (depth < 17) {
			coefficient = 1.6
		} else if (depth <= 30) {
			coefficient = 2
		} else {
			coefficient = 3.2
		}
		let percent: number = (coefficient * 10) / (depth + 10)
		if (percent < 0.4) {
			const numberOutput = [-1, -1, -1]
			return [output, numberOutput]
		}

		const valuePressure: number = (timeInMinute * 3) / (percent * 0.7)
		let value: number = 0
		let pressure: number = 0
		output.push("Для полу-замкнутого цикла")
		for (let i = 5; i <= 10; i++) {
			value = i
			pressure = valuePressure / value
			if (pressure > 170 && pressure < 330) {
				output.push(
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
		const numberOutput = [percent, pressure]
		return [output, numberOutput]
	}
}

async function convertToMatrix(): Promise<any[][]> {
	const sheetIndex = 0
	let numRows: number
	let numCols: number
	let data: any[][]

	try {
		const table: Promise<any> = await window.electron.invoke(
			"invokeMain",
			""
		)

		const workbook = XLSX.read(table)

		const sheet = workbook.Sheets[workbook.SheetNames[sheetIndex]]

		if (!sheet || !sheet["!ref"]) throw new Error("Error: sheet is null")
		const range = XLSX.utils.decode_range(sheet["!ref"])
		numRows = range.e.r + 1
		numCols = range.e.c + 1

		data = new Array(numRows)
			.fill(null)
			.map(() => new Array(numCols).fill(null))

		for (let i = 0; i < numRows; i++) {
			for (let j = 0; j < numCols; j++) {
				const cellAddress = XLSX.utils.encode_cell({ r: i, c: j })
				const cell = sheet[cellAddress]
				if (cell) {
					switch (cell.t) {
						case "s":
							data[i][j] = cell.v
							break
						case "n":
							data[i][j] = cell.v
							break
						case "b":
							data[i][j] = cell.v
							break
						default:
							data[i][j] = null
					}
				} else {
					data[i][j] = null
				}
			}
		}

		return data
	} catch (e: any) {
		throw new Error(e)
	}
}

export { ClosedLoop, SemiClosedLoop, convertToMatrix }
