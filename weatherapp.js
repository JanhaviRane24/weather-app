const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = '9d7dcd47bebe10aae134586d917db2fd';

const cityForm = document.querySelector("#city-form");
const searchInput = document.querySelector("#search-input");
const loading = document.querySelector(".loading");
const error = document.querySelector(".error");
const weatherElm = document.querySelector(".weather");
const weatherBehaviorElm = document.querySelector("#behavior");
const weatherIconElm = document.querySelector("#weather-icon");
const temperatureElm = document.querySelector("#temp");
const humidityElm = document.querySelector("#humidity");
const windSpeedElm = document.querySelector("#wind-speed");
const cityElement = document.querySelector("#city");

cityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = searchInput.value.trim();
    if (!city) return;

    const url = getRequestUrl(city);
    initializeState();

    const weatherData = await getWeatherData(url);
    if (weatherData) processWeatherData(weatherData);
    toggleLoading();
});

function getRequestUrl(city) {
    return `${WEATHER_API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
}

async function getWeatherData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        return await response.json();
    } catch (e) {
        error.hidden = false;
        return null;
    }
}

function toggleLoading() {
    loading.toggleAttribute('hidden');
}

function initializeState() {
    toggleLoading();
    error.hidden = true;
    weatherElm.hidden = true;
}

function processWeatherData(data) {
    console.log(data); // Log for debugging purposes

    const weatherCode = data.weather[0].id; // Get weather code
    const weatherIcon = getWeatherIconUrl(data.weather[0].icon); // Get weather icon from OpenWeatherMap
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const city = data.name;

    const weatherBehavior = getBehavior(weatherCode);

    weatherBehaviorElm.textContent = weatherBehavior;
    temperatureElm.textContent = temperature;
    humidityElm.textContent = humidity;
    windSpeedElm.textContent = windSpeed;
    cityElement.textContent = city;
    weatherIconElm.src = weatherIcon; // Set the icon image

    weatherElm.hidden = false; // Show the weather information
}

// Weather behavior map
const weatherBehaviors = {
    200: 'Thunderstorm with light rain',
    201: 'Thunderstorm with rain',
    202: 'Thunderstorm with heavy rain',
    300: 'Drizzle',
    301: 'Drizzle',
    302: 'Heavy drizzle',
    500: 'Light rain',
    501: 'Moderate rain',
    502: 'Heavy rain',
    503: 'Very heavy rain',
    504: 'Extreme rain',
    511: 'Freezing rain',
    600: 'Light snow',
    601: 'Snow',
    602: 'Heavy snow',
    701: 'Mist',
    711: 'Smoke',
    721: 'Haze',
    731: 'Dust',
    741: 'Fog',
    751: 'Sand',
    761: 'Dust',
    771: 'Squall',
    781: 'Tornado',
    800: 'Clear sky',
    801: 'Few clouds',
    802: 'Scattered clouds',
    803: 'Broken clouds',
    804: 'Overcast clouds',
};

function getBehavior(weatherCode) {
    return weatherBehaviors[+weatherCode] || 'Weather condition not recognized';
}

// Function to get the weather icon URL from OpenWeatherMap
function getWeatherIconUrl(iconCode) {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
