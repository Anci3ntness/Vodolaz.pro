import { makeAutoObservable } from "mobx"

export interface IReverseCycleStore {}

class ReverseCycleStore implements IReverseCycleStore {
	private _duration?: number
	private _deepness?: number

	constructor() {
		this._duration = undefined
		this._deepness = undefined
		makeAutoObservable(this)
	}
	get duration() {
		return this._duration
	}
	get deepness() {
		return this._deepness
	}

	setDuration(value: typeof this._duration) {
		this._duration = value
	}
	setDeepness(value: typeof this._deepness) {
		this._deepness = value
	}
}

export default new ReverseCycleStore() as ReverseCycleStore
