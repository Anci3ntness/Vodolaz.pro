import { observer } from "mobx-react-lite"

import Button from "../../components/common/Button"
import classes from "./index.module.scss"

export interface IToolPageLayout {
	semiChildren?: React.ReactNode
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
	semiChildren,
	...args
}: IToolPageLayout) {
	return (
		<div className={[classes.root, className].join(" ")} {...args}>
			<div
				className={classes.input_area}
				style={!!semiChildren ? { width: "45%" } : { width: "20em" }}
			>
				<div className={classes.input_wrapper}>
					<div className={classes.input_place}>{children}</div>
					{semiChildren && (
						<>
							<div className={classes.divider}></div>
							<div className={classes.input_place}>
								{semiChildren}
							</div>
						</>
					)}
				</div>

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
