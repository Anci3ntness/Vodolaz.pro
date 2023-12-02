import { memo } from "react"

import {
	chatResponceMessageRole,
	customChatResponse,
} from "../../../types/chat-gpt.type"
import classes from "./index.module.scss"

function Message({ id, created, message }: customChatResponse) {
	if (!message?.content ?? true)
		return (
			<div
				className={classes.root}
				style={{
					backgroundColor: "aliceblue",
					alignSelf: "flex-start",
					borderTopLeftRadius: 0,
				}}
			>
				Произошла ошибка
			</div>
		)

	const messageRole = message.role === chatResponceMessageRole.user
	return (
		<div
			className={classes.root}
			style={
				messageRole
					? {
							backgroundColor: "white",
							alignSelf: "flex-end",
							borderTopRightRadius: 0,
					  }
					: {
							backgroundColor: "aliceblue",
							alignSelf: "flex-start",
							borderTopLeftRadius: 0,
					  }
			}
		>
			{message.content}
		</div>
	)
}

export default memo(Message, (prev, next) => {
	return prev.id === next.id
})
