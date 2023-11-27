import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"

import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import { useStore } from "../../store/useStore"
import msgType from "../../types/msgType.type"
import classes from "./index.module.scss"

function ChatBot() {
	const { ChatStore } = useStore()

	const [msgArray, setMsgArray] = useState<msgType[]>(ChatStore.msgArray)
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
					<div className={classes["msg-wrapper"]} id='msg-wrapper'>
						{msgArray.map((e, i) => {
							return (
								<div
									key={i}
									className={classes["msg-text"]}
									style={
										!e.sender
											? { alignSelf: "flex-start" }
											: {}
									}
								>
									{e.message}
								</div>
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
					/>
					<Button
						type='submit'
						title='Отправить сообщение'
						onClick={(e) => {
							e.preventDefault()
							if (inputValue.length === 0) return
							const value: msgType = {
								sender: true,
								message: validate(inputValue),
								time: new Date(),
							}

							setMsgArray((old: msgType[]) => {
								const nov: msgType[] = [value, ...old]
								return nov
							})
							setInputValue("")
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
