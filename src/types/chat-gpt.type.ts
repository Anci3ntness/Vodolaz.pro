import OpenAI from "openai"

//ChatGPT API types
interface GPTOptions {
	apiKey: string
	defaultModel?: GPTModels
	defaultSystemMessage?: string
}

/**
 * OpenAI `/v1/models` api response
 */
interface modelsResponse {
	data: modelsResponseModel[]
	object: string
}
interface modelsResponseModel {
	id: string
	object: string
	owned_by: number
	permission: modelsResponseModelPermission[]
	root?: string | null
	parent?: string | null
}

interface modelsResponseModelPermission {
	id: string
	object: string
	created: number
	allow_create_engine: boolean
	allow_sampling: boolean
	allow_logprobs: boolean
	allow_search_indices: boolean
	allow_view: boolean
	allow_fine_tuning: boolean
	organization: any
	group: any
	is_blocking: boolean
}

enum GPTModel {
	"gpt-3.5-turbo" = "gpt-3.5-turbo",
	"gpt-3.5-turbo-0301" = "gpt-3.5-turbo-0301",
	"gpt-4" = "gpt-4",
	"gpt-4-0314" = "gpt-4-0314",
	"gpt-4-32k" = "gpt-4-32k",
	"gpt-4-32k-0314" = "gpt-4-32k-0314",
}

/**
 * Map of supported models for the api
 */
interface GPTModels {
	"gpt-3.5-turbo": GPTModel
	"gpt-3.5-turbo-0301": GPTModel
	"gpt-4": GPTModel
	"gpt-4-0314": GPTModel
	"gpt-4-32k": GPTModel
	"gpt-4-32k-0314": GPTModel
}

/**
 * OpenAI `/v1/chat/completion` api response
 */

enum chatResponceMessageRole {
	user = "user",
	assistant = "assistant",
	system = "system",
}

interface chatResponse {
	id: string
	object: string
	created: number
	choices: chatResponseChoices[]
	usage: chatResponceUsage
}

interface customChatResponse {
	id: string
	created: number
	message?: chatResponceMessage
}
interface chatResponceMessage {
	content: string | null
	role?: string
}

interface chatResponseChoices {
	message?: chatResponceMessage
	index?: number
	finish_reason?: string
}

interface chatResponceUsage {
	prompt_tokens: number
	completion_tokens: number
	total_tokens: number
}

interface chatRequest {
	model: GPTModels
	messages: chatResponceMessage[]
	temperature?: number
	top_p?: number
	stream?: boolean
	n?: number
	stop?: string | string[]
	max_tokens: number
	presence_penalty?: number
	frequency_penalty?: number
	logit_bias?: {
		[key: string]: number
	}
	user?: string
}

/**
 * Response Choice structure with stream mode
 */
interface chatStreamResponse
	extends OpenAI.Chat.ChatCompletionCreateParamsStreaming {}

export type {
	GPTModels,
	GPTOptions,
	chatStreamResponse,
	chatResponceMessage,
	chatRequest,
	chatResponceUsage,
	chatResponse,
	chatResponseChoices,
	modelsResponse,
	modelsResponseModel,
	modelsResponseModelPermission,
	customChatResponse,
}
export { GPTModel, chatResponceMessageRole }
