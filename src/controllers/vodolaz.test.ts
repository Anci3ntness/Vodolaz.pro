import { ClosedLoop, SemiClosedLoop } from "./vodolaz"

beforeEach(() => {
	jest.resetModules()
})

describe("ClosedLoop.printTime() tests", () => {
	const testCases = [
		{
			balloonVolume: [1, 2],
			pressure: { start: 200, end: 300 },
			difficalty: ["easy", "normal", "hard"],
			zapas: [0.7, 0.8],
			answers: { start: 108, end: 48 },
		},
	]
	testCases.forEach((test) => {
		const { balloonVolume, pressure, difficalty, zapas, answers } = test
		it("Should return number", () => {
			for (let pres = pressure.start; pres <= pressure.end; pres++) {
				balloonVolume.forEach((balloon) => {
					difficalty.forEach((diff) => {
						zapas.forEach((zap) => {
							expect(
								new ClosedLoop().printTime(
									balloon,
									pres,
									diff,
									zap
								)
							).not.toBeNaN()
						})
					})
				})
			}
		})
		it("Should return right answer", () => {
			expect(
				new ClosedLoop().printTime(
					balloonVolume[0],
					pressure.start,
					difficalty[0],
					zapas[0]
				)
			).toBe(answers.start)
			expect(
				new ClosedLoop().printTime(
					balloonVolume[1],
					pressure.end,
					difficalty[2],
					zapas[1]
				)
			).toBe(answers.end)
		})
	})
})
describe("ClosedLoop.printVolumePlusPressure() tests", () => {
	const testCases = [
		{
			time: { start: 30, end: 360 },
			difficalty: ["normal", "hard"],
			zapas: [0.7, 0.8],
			answers: {
				start: {
					hasBalon: true,
					balons: [
						{ balloonVolume: 1, pressure: 200 },
						{ balloonVolume: 2, pressure: 200 },
					],
				},
				end: {
					hasBalon: false,
					balons: [],
				},
			},
		},
	]
	testCases.forEach((test) => {
		const { time, difficalty, zapas, answers } = test
		it("Should return object", () => {
			for (let t = time.start; t <= time.end; t++) {
				difficalty.forEach((diff) => {
					zapas.forEach((zap) => {
						expect(
							typeof new ClosedLoop().printVolumePlusPressure(
								t,
								diff,
								zap
							).hasBalon
						).toBe(typeof Boolean())
						expect(
							new ClosedLoop().printVolumePlusPressure(
								t,
								diff,
								zap
							).balons
						).toBeInstanceOf(Array)
					})
				})
			}
		})
		it("Should return right answer", () => {
			expect(
				new ClosedLoop().printVolumePlusPressure(
					time.start,
					difficalty[0],
					zapas[0]
				)
			).toStrictEqual(answers.start)
			expect(
				new ClosedLoop().printVolumePlusPressure(
					time.end,
					difficalty[1],
					zapas[1]
				)
			).toStrictEqual(answers.end)
		})
	})
})
describe("SemiClosedLoop.printDepthAndTime() tests", () => {
	const testCases = [
		{
			value: { start: 5, end: 10 },
			fullPercent: { start: 30, end: 60 },
			pressure: { start: 200, end: 300 },
			zapas: [0.7, 0.8],
			answers: {
				start: {
					depthNATO: 70,
					depthRF: 96.67,
					depthSport: 43.33,
					timeInMinute: 70,
				},
				end: {
					depthNATO: 30,
					depthRF: 43.33,
					depthSport: 16.67,
					timeInMinute: 480,
				},
			},
		},
	]
	testCases.forEach((test) => {
		const { value, fullPercent, pressure, zapas, answers } = test
		it("Should return object with numbers", () => {
			for (let pres = pressure.start; pres <= pressure.end; pres++) {
				for (
					let percent = fullPercent.start;
					percent <= fullPercent.end;
					percent++
				) {
					for (let val = value.start; val <= value.end; val++) {
						zapas.forEach((zap) => {
							expect(
								new SemiClosedLoop().printDepthAndTime(
									val,
									percent,
									pres,
									zap
								).timeInMinute
							).not.toBeNaN()
							expect(
								new SemiClosedLoop().printDepthAndTime(
									val,
									percent,
									pres,
									zap
								).depthNATO
							).not.toBeNaN()
							expect(
								new SemiClosedLoop().printDepthAndTime(
									val,
									percent,
									pres,
									zap
								).depthRF
							).not.toBeNaN()
							expect(
								new SemiClosedLoop().printDepthAndTime(
									val,
									percent,
									pres,
									zap
								).depthSport
							).not.toBeNaN()
						})
					}
				}
			}
		})
		it("Should return right answer", () => {
			expect(
				new SemiClosedLoop().printDepthAndTime(
					value.start,
					fullPercent.start,
					pressure.start,
					zapas[0]
				)
			).toStrictEqual(answers.start)
			expect(
				new SemiClosedLoop().printDepthAndTime(
					value.end,
					fullPercent.end,
					pressure.end,
					zapas[1]
				)
			).toStrictEqual(answers.end)
		})
	})
})
describe("SemiClosedLoop.printValuePercentPressure() tests", () => {
	const testCases = [
		{
			depth: { start: 2, end: 60 },
			timeInMinute: { start: 30, end: 420 },
			zapas: [0.7, 0.8],
			weatherConditions: [0, 0.1, 0.15],
			answers: {
				start: {
					percent: -1,
					pressure: -1,
					values: [],
				},
				end: {
					percent: 0.45714285714285713,
					pressure: 158.484375,
					values: [
						{ pressure: 316.96875, value: 12 },
						{ pressure: 271.6875, value: 14 },
						{ pressure: 211.3125, value: 18 },
						{ pressure: 190.18125, value: 20 },
					],
				},
			},
		},
	]
	testCases.forEach((test) => {
		const { depth, timeInMinute, zapas, weatherConditions, answers } = test
		it("Should return object with numbers and array", () => {
			for (let dep = depth.start; dep <= depth.end; dep++) {
				for (
					let time = timeInMinute.start;
					time <= timeInMinute.end;
					time++
				) {
					weatherConditions.forEach((weather) => {
						zapas.forEach((zap) => {
							expect(
								new SemiClosedLoop().printValuePercentPressure(
									dep,
									time,
									zap,
									weather
								).percent
							).not.toBeNaN()
							expect(
								new SemiClosedLoop().printValuePercentPressure(
									dep,
									time,
									zap,
									weather
								).pressure
							).not.toBeNaN()
							expect(
								new SemiClosedLoop().printValuePercentPressure(
									dep,
									time,
									zap,
									weather
								).values
							).toBeInstanceOf(Array)
						})
					})
				}
			}
		})
		it("Should return right answer", () => {
			expect(
				new SemiClosedLoop().printValuePercentPressure(
					depth.start,
					timeInMinute.start,
					zapas[0],
					weatherConditions[0]
				)
			).toStrictEqual(answers.start)
			expect(
				new SemiClosedLoop().printValuePercentPressure(
					depth.end,
					timeInMinute.end,
					zapas[1],
					weatherConditions[2]
				)
			).toStrictEqual(answers.end)
		})
	})
})
