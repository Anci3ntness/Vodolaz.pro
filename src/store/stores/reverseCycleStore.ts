import { makeAutoObservable } from "mobx"

export interface IReverseCycleStore {}

class ReverseCycleStore implements IReverseCycleStore {
	private _duration?: number
	private _deepness?: number
	private _output: string[]
	constructor() {
		this._duration = undefined
		this._deepness = undefined
		makeAutoObservable(this)
		this._output = []
	}
	get duration() {
		return this._duration
	}
	get deepness() {
		return this._deepness
	}
	get output() {
		return this._output
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

export default new ReverseCycleStore() as ReverseCycleStore
