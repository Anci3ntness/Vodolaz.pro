import { makeAutoObservable } from "mobx"

import { eZapas } from "../../types/enums"
import msgType from "../../types/output-msg.type"

export interface IDGSCycleStore {}

class DGSCycleStore implements IDGSCycleStore {
	private _duration?: number
	private _deepness?: number
	private _difficalty?: string
	private _zapas: number[]
	private _weatherConditions: string[]
	private _output: msgType[]
	constructor() {
		this._difficalty = undefined
		this._duration = undefined
		this._deepness = undefined
		this._zapas = [eZapas["30%"]]
		this._weatherConditions = []
		this._output = []
		makeAutoObservable(this)
	}
	get duration() {
		return this._duration
	}
	get deepness() {
		return this._deepness
	}
	get difficalty() {
		return this._difficalty
	}
	get zapas() {
		return this._zapas
	}
	get output() {
		return this._output
	}
	get weatherConditions() {
		return this._weatherConditions
	}
	setDifficalty(value: typeof this._difficalty) {
		this._difficalty = value
	}
	setDuration(value: typeof this._duration) {
		this._duration = value
	}
	setDeepness(value: typeof this._deepness) {
		this._deepness = value
	}
	setZapas(value: typeof this._zapas) {
		this._zapas = value
	}
	setWeatherConditions(value: typeof this._weatherConditions) {
		this._weatherConditions = value
	}

	setOutput(value: typeof this._output) {
		this._output = value
	}
}

export default new DGSCycleStore() as DGSCycleStore
