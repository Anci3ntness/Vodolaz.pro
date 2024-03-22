import { makeAutoObservable } from "mobx"

import { eZapas } from "../../types/enums"
import msgType from "../../types/output-msg.type"

export interface IReverseCycleStore {}

class ReverseCycleStore implements IReverseCycleStore {
	private _duration?: number
	private _deepness?: number
	private _zapas: number[]
	private _output: msgType[]
	constructor() {
		this._duration = undefined
		this._deepness = undefined
		this._zapas = [eZapas["30%"]]
		this._output = []
		makeAutoObservable(this)
	}
	get duration() {
		return this._duration
	}
	get deepness() {
		return this._deepness
	}
	get zapas() {
		return this._zapas
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
	setZapas(value: typeof this._zapas) {
		this._zapas = value
	}

	setOutput(value: typeof this._output) {
		this._output = value
	}
}

export default new ReverseCycleStore() as ReverseCycleStore
