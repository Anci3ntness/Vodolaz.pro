import OpenAI from "openai"

import {
	GPTModel,
	chatResponceMessageRole,
	customChatResponse,
} from "../types/chat-gpt.type"

export default class OpenAiHandler {
	private openai

	constructor() {
		this.openai = new OpenAI({
			apiKey: "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",
			dangerouslyAllowBrowser: true,
			maxRetries: 1,
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
	async createChatCompletion(
		message: string,
		context?: customChatResponse[]
	) {
		try {
			const cont =
				context
					?.slice(0, 2)
					.reverse()
					.map(
						(
							e
						): OpenAI.Chat.Completions.ChatCompletionMessageParam => {
							return {
								role: "system",
								content: e.message?.content || "",
							}
						}
					) || []
			const messages = [
				...cont,
				{ role: chatResponceMessageRole.user, content: message },
			]

			const params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
				model: GPTModel["gpt-3.5-turbo"],
				messages: messages,
			}
			const completion = await this.openai.chat.completions.create(params)
			return completion
		} catch (err) {
			console.log(err)
			return {
				id: `chatcmpl-${new Date().getTime()}`,
				created: new Date().getTime(),
				choices: [
					{
						message: {
							content:
								"Произошла ошибка, проверьте ваше подключение",
						},
					},
				],
			}
		}
	}
}
