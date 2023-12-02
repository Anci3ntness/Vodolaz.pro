import OpenAI from "openai"

import { GPTModel, chatResponceMessageRole } from "../types/chat-gpt.type"

export default class OpenAiHandler {
	private openai

	constructor() {
		this.openai = new OpenAI({
			apiKey: "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",
			dangerouslyAllowBrowser: true,
		})
	}
	async getModelesList() {
		const response = await this.openai.models.list()
		return response
	}
	async getModel(model: GPTModel) {
		const response = await this.openai.models.retrieve(model)
		return response
	}
	async createChatCompletion(message: string) {
		const params = {
			model: GPTModel["gpt-3.5-turbo"],
			messages: [
				{ role: chatResponceMessageRole.user, content: message },
			],
		}
		const completion = await this.openai.chat.completions.create(params)
		return completion
	}
}
