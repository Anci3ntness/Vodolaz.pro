import OpenAI from "openai"

import {
	GPTModel,
	chatResponceMessageRole,
	customChatResponse,
} from "../types/chat-gpt.type"

export default class OpenAiHandler {
	async getModelsList() {
		try {
			const response: Promise<any> = await window.electron.invoke(
				"invokeAi",
				["getModelsList"]
			)

			return response
		} catch (err) {
			console.error(err)
			return {}
		}
	}
	async getModel(model: GPTModel) {
		try {
			const response: Promise<any> = await window.electron.invoke(
				"invokeAi",
				["getModel", model]
			)
			return response
		} catch (err) {
			console.error(err)
			return {}
		}
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
			const response: Promise<any> = await window.electron.invoke(
				"invokeAi",
				["createChatCompletion", params]
			)
			return response
		} catch (err) {
			console.error(err)
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
