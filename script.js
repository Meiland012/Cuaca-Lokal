// Mendapatkan elemen-elemen HTML yang diperlukan
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const WeatherCardDiv = document.querySelector(".kartu-cuaca");

// API key dari OpenWeatherMap
const API_KEY = "fff91c4592cf6003d8b50e0fc8e2c9de";

// Fungsi untuk membuat kartu cuaca berdasarkan data cuaca
const creadWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0){
        return `<div class="detail">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Suhu: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Angin: ${weatherItem.wind.speed} M/S</h4>
                <h4>Kelembaban: ${weatherItem.main.humidity}%</h4>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="icon-cuaca">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>`;
    } else {
        return ` <li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="icon-cuaca">
            <h4>Suhu: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
            <h4>Angin: ${weatherItem.wind.speed} M/S</h4>
            <h4>Kelembaban: ${weatherItem.main.humidity}%</h4>
        </li>`;
    }
}

// Fungsi untuk mendapatkan detail cuaca berdasarkan nama kota, latitude, dan longitude
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        const fivedaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt * 1000).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
                return true;
            }
            return false;
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        WeatherCardDiv.innerHTML = "";

        console.log(fivedaysForecast);
        fivedaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", creadWeatherCard(cityName, weatherItem, index));
            } else {
                WeatherCardDiv.insertAdjacentHTML("beforeend", creadWeatherCard(cityName, weatherItem, index));
            }
        })
    }).catch(error => {
        console.error("Error fetching weather data:", error);
        alert("Kesalahan terjadi saat mengambil perkiraan cuaca! " + error.message);
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) {
        alert("Nama kota tidak boleh kosong!");
        return;
    }
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    }).then(data => {
        console.log(data); // Log data untuk melihat output
        if (!data.length) {
            alert(`Tidak ada koordinat yang ditemukan untuk ${cityName}`);
            return;
        }
        const { name, lat, lon } = data[0];
        console.log(`Koordinat untuk ${name}: Lat ${lat}, Lon ${lon}`); // Log koordinat
        getWeatherDetails(name, lat, lon);
    }).catch(error => {
        console.error("Kesalahan terjadi saat mengambil koordinat:", error);
        alert("Kesalahan terjadi saat mengambil koordinat!");
    });
}

searchButton.addEventListener("click", getCityCoordinates);
