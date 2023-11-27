import { makeAutoObservable } from "mobx"

export interface ISemiCycleStore {}

class SemiCycleStore implements ISemiCycleStore {
	private _density?: number
	private _volume?: number
	private _pressure?: number

	constructor() {
		this._density = undefined
		this._volume = undefined
		this._pressure = undefined
		makeAutoObservable(this)
	}
	get density() {
		return this._density
	}
	get volume() {
		return this._volume
	}
	get pressure() {
		return this._pressure
	}

	setVolume(value: typeof this._volume) {
		this._volume = value
	}
	setDensity(value: typeof this._density) {
		this._density = value
	}
	setPressure(value: typeof this._pressure) {
		this._pressure = value
	}
}

export default new SemiCycleStore() as SemiCycleStore
