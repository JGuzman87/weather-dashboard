const currentWeatherContainer = document.getElementById('currentWeather');
const forecastContainer = document.getElementById('forecastWeather');
const userContainer = document.getElementById('weatherData');
const fetchButton = document.getElementById('fetch-button')
const cityInput = document.getElementById('city');
const searchHistoryList = document.getElementById('search-history-list');

function getWeatherData(cityName){
    const apiKey = 'e1289235d4638591919c1af0c4190754';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=${apiKey}&units=imperial`;
   
    fetch(weatherUrl)
    .then(response => response.json())
    .then(data => displayCurrentWeather(data))
    

    fetch(forecastUrl)
    .then(response => response.json())
    .then(data => displayForecast(data))
   
}
function displayCurrentWeather(data) {
    currentWeatherContainer.innerHTML = ''; 
    if (data.cod === 404) {
        currentWeatherContainer.textContent = 'Failed to retrieve data. Please try another city.';
        return;
    }

    const dateTime = new Date(data.dt * 1000);
    const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    const currentWeatherHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>Date: ${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}</p>
        <img src="${weatherIcon}" alt="${data.weather[0].description}" style="width:50px;">
        <p>Temp: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;

    currentWeatherContainer.innerHTML = currentWeatherHTML;
}

function displayForecast(data) {
    forecastContainer.innerHTML = ''; 
    if (data.cod !== "200") {
        forecastContainer.textContent = 'Failed to retrieve forecast data. Please try another city.';
        return;
    }

    const forecastTitle = document.createElement('h2');
    forecastTitle.textContent = '5-Day Forecast';
    forecastContainer.appendChild(forecastTitle);

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) { 
            const dateTime = new Date(forecast.dt * 1000);
            const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

            const forecastHTML = `
                <div>
                    <p>Date: ${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}</p>
                    <img src="${weatherIcon}" alt="${forecast.weather[0].description}" style="width:50px;">
                    <p>Temp: ${forecast.main.temp} °C</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind: ${forecast.wind.speed} m/s</p>
                </div>
            `;

            forecastContainer.innerHTML += forecastHTML;
        }
    });
}

function loadSearchHistory() {
    const searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryList.innerHTML = ''; 
    searches.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.onclick = () => getWeatherData(city); 
        searchHistoryList.appendChild(li);
    });
}


function saveSearchHistory(city) {
    const searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searches.includes(city)) { 
        searches.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searches));
    }
    loadSearchHistory(); 
}


fetchButton.addEventListener('click', function () {
    const cityName = cityInput.value;
    getWeatherData(cityName);
    saveSearchHistory(cityName);
});


document.addEventListener('DOMContentLoaded', loadSearchHistory);