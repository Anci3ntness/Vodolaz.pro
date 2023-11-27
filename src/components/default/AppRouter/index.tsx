import React from "react"
import { Route, Routes } from "react-router-dom"

import { publicRoutes } from "../../../routes"

export default function AppRouter() {
	return (
		<Routes>
			{publicRoutes.map(({ path, Component }) => {
				return <Route key={path} path={path} Component={Component} />
			})}
		</Routes>
	)
}
