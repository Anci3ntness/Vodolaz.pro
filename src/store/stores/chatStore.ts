import { makeAutoObservable } from "mobx"

import msgType from "../../types/msgType.type"

export interface IChatStore {
	msgArray: msgType[]
}

class ChatStore implements IChatStore {
	private _msgArray: msgType[]
	constructor() {
		this._msgArray = []
		makeAutoObservable(this)
	}
	get msgArray() {
		return this._msgArray
	}
	setMsgArray(value: msgType[]) {
		this._msgArray = value
	}
}

export default new ChatStore() as ChatStore
