import Routers from "./constants/routers.json"
import ChatBot from "./pages/ChatBot"
import CyclePage from "./pages/CyclePage"
import DGSCyclePage from "./pages/DGSCyclePage"
import MainPage from "./pages/MainPage"
import ReverseCyclePage from "./pages/ReverseCyclePage"
import SemiCyclePage from "./pages/SemiCyclePage"

export const publicRoutes = [
	{
		title: "Главная",
		path: Routers.Main_Route,
		Component: MainPage,
	},
	{
		title: "Замкнутый цикл",
		path: Routers.Cycle_Route,
		Component: CyclePage,
	},
	{
		title: "Полу-замкнутый цикл",
		path: Routers.SemiCycle_Route,
		Component: SemiCyclePage,
	},
	{
		title: "Обратная функция для полу-замкнутого цикла",
		path: Routers.ReverseCycle_Route,
		Component: ReverseCyclePage,
	},
	{
		title: "Подбор ДГС",
		path: Routers.DGSCycle_Route,
		Component: DGSCyclePage,
	},
	{
		title: "Чат-Бот",
		path: Routers.Chat_Route,
		Component: ChatBot,
	},
]
