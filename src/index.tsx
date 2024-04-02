import "./styles/global.scss"

import ReactDOM from "react-dom/client"

import App from "./App"
import store, { StoreContext } from "./store/useStore"

//Подключаются глобальные стили и state manager (mobx)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

type tElectron = any
interface IElectron extends tElectron {
	invoke: (channel: string, args: any[] | string) => Promise<any>
}

declare global {
	interface Window {
		electron: IElectron
	}
}
//Декларируется поле electron в глобальный интерфейс Window для корректной работы typescript с preload-функциями электрона

export function AppWithProvider() {
	return (
		<StoreContext.Provider value={store}>
			<App />
		</StoreContext.Provider>
	)
	//Возвращает обьект приложения, обернутый в наш state manager
}

root.render(<AppWithProvider />)

//Входная точка фронта приложения, рендерится корневой элемент.
