import React, { useEffect } from 'react'
import './Weather.css'
import search_icon from '../assets/search_icon.svg'
import clear from '../assets/clear.svg'
import clouds from '../assets/clouds.svg'
import humidity from '../assets/humidity.svg'
import rain from '../assets/rain.svg'
import snow from '../assets/snow.svg'
import wind from '../assets/wind.svg'




const Weather = () => {

    const search = async (city) => {
        try{
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`

            const response = await fetch(url);

            const data = await response.json(); 

            console.log(data);
            
        }
        catch{

        }
    }

    useEffect(() => {
        search("London")
    }, [])

  return (
    <div className='weather'>
        <div className="search-bar">
            <input type="text" placeholder='Search' />
            <img src= {search_icon} alt="Search icon" />
        </div>
        <img src={clear} alt="" className='weather-icon'/>
        <p className='temperature'>16°C</p>
        <p className='location'>London</p>
        <div className="weather-data">
            <div className="col">
                <img src= {humidity} alt="" />
                <div>
                    <p>91 %</p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className="col">
                <img src= {wind} alt="" />
                <div>
                    <p>3.6 Km/h</p>
                    <span>Wind Speed</span>
                </div>
            </div>
        </div>
        
      
    </div>
  )
}

export default Weather
