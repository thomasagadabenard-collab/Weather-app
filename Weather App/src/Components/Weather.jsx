import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search_icon.svg'
import clear from '../assets/clear.svg'
import clouds from '../assets/clouds.svg'
import humidity from '../assets/humidity.svg'
import rain from '../assets/rain.svg'
import snow from '../assets/snow.svg'
import wind from '../assets/wind.svg'

const Weather = () => {

    const inputRef = useRef();

    const [weatherData, setWeatherData] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [unit, setUnit] = useState("metric");
    const [recentSearches, setRecentSearches] = useState([]);

    const allIcons = {
        "01d": clear,
        "01n": clear,
        "02d": clouds,
        "02n": clouds,
        "03d": clouds,
        "03n": clouds,
        "04d": rain,
        "09d": rain,
        "10d": rain,
        "10n": rain,
        "13d": snow,
        "13n": snow
    };

    const search = async (city) => {

        if (!city) {
            alert("Enter city name");
            return;
        }

        try {
            // CURRENT WEATHER
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) {
                alert("City not found");
                return;
            }

            const icon = allIcons[data.weather[0].icon] || clear;

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });

            // 5 DAY FORECAST
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${import.meta.env.VITE_APP_ID}`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            const dailyForecast = forecastData.list.filter((item, index) => index % 8 === 0);
            setForecast(dailyForecast);

            // SAVE RECENT SEARCHES
            let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

            if (!recent.includes(city)) {
                recent.unshift(city);
                recent = recent.slice(0, 5);
                localStorage.setItem("recentSearches", JSON.stringify(recent));
                setRecentSearches(recent);
            }

        } catch (error) {
            setWeatherData(null);
            console.error("Error fetching data", error);
        }
    };

    // Load default city + recent searches
    useEffect(() => {
        search("London");
        
    }, []);

    return (
        <div className='weather'>

            {/* SEARCH BAR */}
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder='Search' />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={() => search(inputRef.current.value)}
                />
            </div>

            {/* UNIT TOGGLE */}
            <div className="unit-toggle">
                <button onClick={() => setUnit("metric")}>°C</button>
                <button onClick={() => setUnit("imperial")}>°F</button>
            </div>

            {/* RECENT SEARCHES */}
            <div className="recent">
                {recentSearches.map((city, index) => (
                    <p key={index} onClick={() => search(city)}>
                        {city}
                    </p>
                ))}
            </div>

            {/*WEATHER DISPLAY */}
            {weatherData && (
                <>
                    <img src={weatherData.icon} alt="" className='weather-icon' />
                    <p className='temperature'>
                        {weatherData.temperature}°{unit === "metric" ? "C" : "F"}
                    </p>
                    <p className='location'>{weatherData.location}</p>

                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity} alt="humidity icon" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>

                        <div className="col">
                            <img src={wind} alt="wind icon" />
                            <div>
                                <p>{weatherData.windSpeed} {unit === "metric" ? "m/s" : "mph"}</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* 5 DAY FORECAST */}
            <div className="forecast">
                {forecast.map((day, index) => (
                    <div key={index} className="forecast-day">
                        <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                        <p>{Math.floor(day.main.temp)}°</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Weather;
