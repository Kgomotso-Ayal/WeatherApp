const apiKey = '2fa73590fd8b5a4c6e68098ad5625395'; // OpenWeatherMap API key
const searchBox = document.querySelector('.search-box');
const cityOptions = document.querySelector('.city-options');
const cityDisplay = document.querySelector('.city');
const dateDisplay = document.querySelector('.date');
const tempDisplay = document.querySelector('.temp');
const weatherDisplay = document.querySelector('.weather');
const hiLowDisplay = document.querySelector('.hi-low');

// Format today's date
function formatDate(d) {
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Fetch matching cities
async function searchCities(query) {
	const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
	return await res.json();
}

// Fetch weather by coordinates
async function getWeather(lat, lon) {
	const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
	return await res.json();
}

// Show matching city options
function showCityOptions(cities) {
	cityOptions.innerHTML = '';
	cities.forEach(city => {
		const li = document.createElement('li');
		li.textContent = `${city.name}, ${city.state || ''} ${city.country}`;
		li.dataset.lat = city.lat;
		li.dataset.lon = city.lon;
		cityOptions.appendChild(li);
	});
	cityOptions.style.display = 'block';
}

// On select city from list
cityOptions.addEventListener('click', async (e) => {
	if (e.target.tagName === 'LI') {
		const lat = e.target.dataset.lat;
		const lon = e.target.dataset.lon;
		const weather = await getWeather(lat, lon);
		displayWeather(weather);
		cityOptions.style.display = 'none';
		searchBox.value = '';
	}
});

// Show weather data
function displayWeather(weather) {
  const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
	cityDisplay.textContent = `${weather.name}, ${countryNames.of(weather.sys.country)}`;
	dateDisplay.textContent = formatDate(new Date());
	tempDisplay.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;
	weatherDisplay.textContent = weather.weather[0].main;
	hiLowDisplay.textContent = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;
}

// Handle search input
searchBox.addEventListener('keypress', async (e) => {
	if (e.key === 'Enter') {
		const query = searchBox.value;
		if (!query) return;

		const cities = await searchCities(query);
		if (cities.length > 1) {
			showCityOptions(cities);
		} else if (cities.length === 1) {
			const weather = await getWeather(cities[0].lat, cities[0].lon);
			displayWeather(weather);
			searchBox.value = '';
		} else {
			alert('City not found');
		}
	}
});

