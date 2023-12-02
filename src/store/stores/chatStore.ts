import { makeAutoObservable } from "mobx"

import { customChatResponse } from "../../types/chat-gpt.type"

export interface IChatStore {
	msgArray: customChatResponse[]
}

class ChatStore implements IChatStore {
	private _msgArray: customChatResponse[]
	constructor() {
		this._msgArray = []
		makeAutoObservable(this)
	}
	get msgArray() {
		return this._msgArray
	}
	setMsgArray(value: customChatResponse[]) {
		this._msgArray = value
	}
}

export default new ChatStore() as ChatStore
