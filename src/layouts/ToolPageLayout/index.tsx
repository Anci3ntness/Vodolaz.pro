import { observer } from "mobx-react-lite"

import Button from "../../components/common/Button"
import classes from "./index.module.scss"

export interface IToolPageLayout {
	children: React.ReactNode
	btnOnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	output: React.ReactNode
	className: string
}

function ToolPageLayout({
	children,
	btnOnClick,
	output,
	className,
	...args
}: IToolPageLayout) {
	return (
		<div className={[classes.root, className].join(" ")} {...args}>
			<div className={classes.input_area}>
				<div className={classes.input_place}>{children}</div>
				<Button
					className={classes.submit}
					onClick={btnOnClick}
					type='submit'
				>
					Вычислить
				</Button>
			</div>
			<div className={classes.output_area}>{output}</div>
		</div>
	)
}
export default observer(ToolPageLayout)
