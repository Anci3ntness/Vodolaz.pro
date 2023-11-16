// import Admin from './pages/Admin'
// import Auth from './pages/Auth'
// import Basket from './pages/Basket'
// import DevicePage from './pages/DevicePage'
// import Shop from './pages/Shop'
import Routers from "./constants/routers.json"

export const authRoutes = [
	{
		path: Routers.Admin_Route,
		Component: null,
	},
]

export const publicRoutes = [
	{
		path: Routers.Main_Route,
		Component: null,
	},
]
