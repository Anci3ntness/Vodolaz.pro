import React, { useEffect, useState } from "react"

export default function MainPage() {
	const [pogoda, setPogoda] = useState({ weather: [] })

	useEffect(() => {
		fetch(
			"http://api.openweathermap.org/data/2.5/weather?id=524901&lang=ru&appid=f8e55e729e04e339d26abab86d9211a3"
		)
			.then(function (resp) {
				return resp.json()
			})
			.then(function (data) {
				data.main.temp = Math.round(data.main.temp - 273) + "&deg;"
				setPogoda(data)
				console.log(data)
			})
			.catch(function () {
				//Обрабатываем ошибки
			})
	}, [])

	return (
		<div>
			<img
				alt=''
				src={`https://openweathermap.org/img/wn/${pogoda?.weather?.[0]?.["icon"]}@2x.png`}
			/>
		</div>
	)
}
