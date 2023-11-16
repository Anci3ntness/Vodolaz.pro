import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import Routers from "../../../constants/routers.json"
import { publicRoutes } from "../../../routes"

export default function AppRouter() {
	return (
		<Routes>
			{publicRoutes.map(({ path, Component }) => {
				return <Route key={path} path={path} Component={Component} />
			})}
			<Route path='*' element={<Navigate to={Routers.Main_Route} />} />
		</Routes>
	)
}
