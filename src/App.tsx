import { Fragment, PropsWithChildren } from "react"
import { HashRouter } from "react-router-dom"

import AppRouter from "./components/default/AppRouter"
import indexLayout from "./layouts/indexLayout"

//Подключается зависимости для работы с router dom
function App() {
	const BaseLayout = ({ children }: PropsWithChildren) => (
		<Fragment>{children}</Fragment>
	)
	let Layout = BaseLayout

	Layout = indexLayout
	//Создается фрагмент для работы с лейаутом приложения
	return (
		<HashRouter>
			<Layout>
				<AppRouter />
			</Layout>
		</HashRouter>
	)
	//Возвращается обьект приложения, обернутый в route-контроллер и наш лейаут
}

export default App
