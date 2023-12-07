import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"

import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import GPTMessage from "../../components/elements/GPTMessage"
import OpenAiHandler from "../../controllers/chat"
import { useStore } from "../../store/useStore"
import {
	chatResponceMessageRole,
	customChatResponse,
} from "../../types/chat-gpt.type"
import classes from "./index.module.scss"

function ChatBot() {
	const { ChatStore } = useStore()

	const bot = new OpenAiHandler()

	const [msgArray, setMsgArray] = useState<customChatResponse[]>(
		ChatStore.msgArray
	)
	const [loading, setLoading] = useState(false)
	const [inputValue, setInputValue] = useState("")

	useEffect(() => {
		ChatStore.setMsgArray(msgArray)
		const msgArea = document.getElementById("msg-wrapper")
		msgArea?.scrollTo(0, 0)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [msgArray])

	function validate(text: string) {
		let localText = text
		localText.trim()
		return localText
	}
	return (
		<div className={classes.root}>
			<div className={classes["chat-area"]}>
				<div className={classes["msg-area"]}>
					<div
						className={[
							classes.loading,
							loading
								? classes.loading_animation
								: classes.destroy_animation,
						].join(" ")}
					>
						Обработка запроса...
					</div>
					<div className={classes["msg-wrapper"]} id='msg-wrapper'>
						{msgArray.map((e, i) => {
							return (
								<GPTMessage
									key={e.id}
									id={e.id}
									created={e.created}
									message={e.message}
								/>
							)
						})}
					</div>
				</div>

				<form className={classes["input-area"]}>
					<Input
						value={inputValue}
						type='text'
						name='message'
						autoComplete='off'
						maxLength={1024}
						onChange={({ target }) => {
							setInputValue(target.value)
						}}
						disabled={loading}
						style={loading ? { backgroundColor: "#d9d9d9" } : {}}
					/>
					<Button
						type='submit'
						title='Отправить сообщение'
						onClick={(e) => {
							e.preventDefault()
							if (inputValue.length === 0) return
							const validValue = validate(inputValue)
							const value = {
								id: `chatcmpl-${new Date().getTime()}`,
								created: new Date().getTime(),
								message: {
									content: validValue,
									role: chatResponceMessageRole.user,
								},
							}
							setMsgArray((prev: customChatResponse[]) => {
								const nov: customChatResponse[] = [
									value,
									...prev,
								]
								return nov
							})
							setInputValue("")
							setLoading(true)
							bot.createChatCompletion(validValue, msgArray)
								.then((res) =>
									setMsgArray((prev) => {
										const resMsg = {
											id: res.id,
											created: res.created,
											message: res.choices[0].message,
										}
										if (typeof resMsg === "undefined")
											return prev
										return [resMsg, ...prev]
									})
								)
								.catch((err) => console.error(err))
								.finally(() => {
									setLoading(false)
								})
						}}
					>
						Отправить
					</Button>
				</form>
			</div>
		</div>
	)
}
export default observer(ChatBot)
