import { makeAutoObservable } from "mobx"

import msgType from "../../types/output-msg.type"

export interface ISemiCycleStore {}

class SemiCycleStore implements ISemiCycleStore {
	private _density?: number
	private _volume?: number
	private _pressure?: number
	private _output: msgType[]
	constructor() {
		this._density = undefined
		this._volume = undefined
		this._pressure = undefined
		this._output = []
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
	get output() {
		return this._output
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

	setOutput(value: typeof this._output) {
		this._output = value
	}
}

export default new SemiCycleStore() as SemiCycleStore
