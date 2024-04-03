import * as XLSX from "xlsx"

import msgType from "../types/output-msg.type"

class ClosedLoop {
	private EASY: string = "easy"
	private NORMAL: string = "normal"
	private HARD: string = "hard"
	printTime(
		balloonVolume: number,
		pressure: number,
		difficulty: string,
		zapas?: number
	): number {
		let defaultZapas = 0.7
		let timeInMinute: number =
			pressure * balloonVolume * (zapas ?? defaultZapas)

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
		return timeInMinute
	}
	printTimeOutput(
		balloonVolume: number,
		pressure: number,
		difficulty: string,
		zapas?: number
	): msgType[] {
		let output: msgType[] = []
		const timeInMinute = this.printTime(
			balloonVolume,
			pressure,
			difficulty,
			zapas
		)
		output.push({
			main: false,
			text: `Расчетное время экспозиции на грунте в минутах: ${timeInMinute.toFixed(
				2
			)}`,
		})
		output.push({
			main: false,
			text: `В часах: ${(timeInMinute / 60).toFixed(2)}`,
		})
		return output
	}
	printVolumePlusPressure(
		time: number,
		difficulty: string,
		zapas?: number
	): { hasBalon: boolean; balons: Record<PropertyKey, number>[] } {
		let array: number[] = [1, 2]
		let doubleTime: number = 0
		let flag: boolean
		let hasBalon: boolean = false
		let balons: Record<PropertyKey, number>[] = []
		let defaultZapas = 0.7
		if (difficulty === this.NORMAL) {
			let a: number = Math.floor(time / 20)
			a = a * 8
			doubleTime = (time + a) * 1.5
		}
		if (difficulty === this.HARD) {
			let a: number = Math.floor(time / 20)
			a = a * 8
			doubleTime = (time + a) * 2
		}

		array.forEach((balloonVolume) => {
			flag = false

			for (let pressure = 200; pressure < 300; pressure++) {
				if (
					doubleTime <=
						pressure * balloonVolume * (zapas ?? defaultZapas) &&
					!flag
				) {
					flag = true
					hasBalon = true
					balons.push({ balloonVolume, pressure })
				}
			}
		})
		return { hasBalon, balons }
	}
	printVolumePlusPressureOutput(
		time: number,
		difficulty: string,
		zapas?: number
	): msgType[] {
		let output: msgType[] = []
		const { hasBalon, balons } = this.printVolumePlusPressure(
			time,
			difficulty,
			zapas
		)
		output.push({
			main: true,
			text: "Для замкнутого цикла",
		})
		balons.forEach(
			({ balloonVolume, pressure }: Record<PropertyKey, number>) => {
				output.push({
					main: false,
					text: `Нужен баллон объемом ${balloonVolume} литров и с давлением не меньше ${pressure} паскаль.`,
				})
			}
		)
		if (!hasBalon)
			output.push({
				main: false,
				text: "Нет подходящего снаряжения.",
			})
		return output
	}
}
class SemiClosedLoop {
	printDepthAndTime(
		value: number,
		fullPercent: number,
		pressure: number,
		zapas?: number
	): {
		timeInMinute: number
		depthSport: number
		depthNATO: number
		depthRF: number
	} {
		const percent: number = fullPercent / 100
		let defaultZapas = 0.7
		let timeInMinute: number = pressure * value * (zapas ?? defaultZapas)
		timeInMinute = timeInMinute / (3 / percent)

		const depthSport: number =
			Math.round(((1.6 / percent) * 10 - 10) * 100) / 100
		const depthNATO: number =
			Math.round(((2.4 / percent) * 10 - 10) * 100) / 100
		const depthRF: number =
			Math.round(((3.2 / percent) * 10 - 10) * 100) / 100

		return { timeInMinute, depthSport, depthNATO, depthRF }
	}
	printDepthAndTimeOutput(
		value: number,
		fullPercent: number,
		pressure: number,
		zapas?: number
	): [msgType[], number[]] {
		let output: msgType[] = []
		const { timeInMinute, depthSport, depthNATO, depthRF } =
			this.printDepthAndTime(value, fullPercent, pressure, zapas)
		output.push({
			main: false,
			text: `Расчетное время экспозиции на грунте в минутах: ${timeInMinute.toFixed(
				2
			)}, в часах: ${(timeInMinute / 60).toFixed(2)}`,
		})

		output.push({
			main: false,
			text: `Глубина погружения для спортсменов: ${depthSport.toFixed(
				2
			)}у`,
		})
		output.push({
			main: false,
			text: `Глубина погружения для военных НАТО: ${depthNATO.toFixed(
				2
			)}`,
		})
		output.push({
			main: false,
			text: `Глубина погружения для военных РФ: ${depthRF.toFixed(2)}`,
		})
		const numberOutput = [timeInMinute, depthSport]
		return [output, numberOutput]
	}
	printValuePercentPressure(
		depth: number,
		timeInMinute: number,
		zapas?: number,
		weatherConditions?: number
	): {
		percent: number
		pressure: number
		values: Record<PropertyKey, number>[]
	} {
		let defaultZapas = 0.7
		let array: number[] = [7, 10, 12, 14, 18, 20, 24]
		let flag: boolean = false
		let coefficient: number
		let values: Record<PropertyKey, number>[] = []
		if (depth < 17) {
			coefficient = 1.6
		} else if (depth <= 30) {
			coefficient = 2
		} else {
			coefficient = 3.2
		}
		let percent: number = (coefficient * 10) / (depth + 10)
		if (percent < 0.4) {
			return { percent: -1, pressure: -1, values }
		}
		let valuePressure: number = 0

		if (!!weatherConditions && weatherConditions !== 0) {
			valuePressure =
				(timeInMinute * 3) / (percent * (zapas ?? defaultZapas))
			valuePressure =
				valuePressure - valuePressure * (1 - (zapas ?? defaultZapas))
			valuePressure = valuePressure + valuePressure * weatherConditions
			valuePressure =
				valuePressure + valuePressure * (1 - (zapas ?? defaultZapas))
		} else
			valuePressure =
				(timeInMinute * 3) / (percent * (zapas ?? defaultZapas))

		let value: number = 0
		let pressure: number = 0

		array.forEach((i: number) => {
			value = i
			pressure = valuePressure / value
			if (pressure > 170 && pressure < 330) {
				values.push({ value, pressure })
				flag = true
			}
		})

		if (!flag) {
			pressure = -1
			percent = -1
		}
		return { percent, pressure, values }
	}
	printValuePercentPressureOutput(
		depth: number,
		timeInMinute: number,
		zapas?: number,
		weatherConditions?: number
	): [msgType[], number[]] {
		let output: msgType[] = []

		const { percent, pressure, values } = this.printValuePercentPressure(
			depth,
			timeInMinute,
			zapas,
			weatherConditions
		)

		output.push({
			main: true,
			text: "Для полу-замкнутого цикла",
		})
		values.forEach(({ value, pressure }) => {
			output.push({
				main: false,
				text: `Для баллона в ${value.toFixed(
					2
				)} литров давление составит в ${pressure.toFixed(
					2
				)} паскаль. Объем смеси равен ${(value * pressure).toFixed(
					2
				)} л.`,
			})
		})

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
					data[i][j] = cell.v
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
