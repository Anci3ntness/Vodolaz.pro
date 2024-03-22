import { makeAutoObservable } from "mobx"

import { eZapas } from "../../types/enums"
import msgType from "../../types/output-msg.type"

export interface ICycleStore {}

class CycleStore implements ICycleStore {
	private _difficalty?: string
	private _volume?: number
	private _pressure?: number
	private _zapas: number[]
	private _output: msgType[]
	constructor() {
		this._difficalty = undefined
		this._volume = undefined
		this._pressure = undefined
		this._output = []
		this._zapas = [eZapas["30%"]]
		makeAutoObservable(this)
	}
	get difficalty() {
		return this._difficalty
	}
	get volume() {
		return this._volume
	}
	get pressure() {
		return this._pressure
	}
	get zapas() {
		return this._zapas
	}
	get output() {
		return this._output
	}
	setDifficalty(value: typeof this._difficalty) {
		this._difficalty = value
	}
	setVolume(value: typeof this._volume) {
		this._volume = value
	}
	setPressure(value: typeof this._pressure) {
		this._pressure = value
	}
	setZapas(value: typeof this._zapas) {
		this._zapas = value
	}
	setOutput(value: typeof this._output) {
		this._output = value
	}
}

export default new CycleStore() as CycleStore
