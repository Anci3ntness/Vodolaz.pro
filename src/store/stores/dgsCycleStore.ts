import { makeAutoObservable } from "mobx"

export interface IDGSCycleStore {}

class DGSCycleStore implements IDGSCycleStore {
	private _duration?: number
	private _deepness?: number
	private _difficalty?: string
	private _output: string[]
	constructor() {
		this._difficalty = undefined
		this._duration = undefined
		this._deepness = undefined
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
	get output() {
		return this._output
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

	setOutput(value: typeof this._output) {
		this._output = value
	}
}

export default new DGSCycleStore() as DGSCycleStore
