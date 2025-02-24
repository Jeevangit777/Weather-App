"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function WeatherApp() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity) {
      setCity(savedCity);
      displayWeatherData(savedCity);
    }
  }, []);

  const displayWeatherData = async (searchCity = city) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
      );
      if (!forecastRes.ok) throw new Error("Forecast data not found");
      const forecastData = await forecastRes.json();
      setForecast(forecastData.list);

      localStorage.setItem("lastCity", searchCity);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-500 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
          Weather App
        </h1>
        <div className="flex justify-center">
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="w-3/4 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          />
        </div>
        <div className="text-center">
          <Button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => displayWeatherData(city)}
          >
            Get Weather
          </Button>
        </div>
        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading...
          </p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {weather && !loading && !error && (
          <Card className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {weather.name}
            </h2>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              className="w-20 h-20 mx-auto"
            />
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Temperature: {weather.main.temp}°C
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Humidity: {weather.main.humidity}%
            </p>
            <p className="text-gray-500 dark:text-gray-400 capitalize">
              {weather.weather[0].description}
            </p>
          </Card>
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            5-Day Forecast
          </h3>
          <Slider
            min={0}
            max={forecast.length - 5}
            step={1}
            value={[sliderIndex]}
            onValueChange={(value) => setSliderIndex(value[0])}
            className="my-4"
          />
          <div className="space-y-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
            {forecast
              .slice(sliderIndex, sliderIndex + 5)
              .map((forecastItem, index) => (
                <Card
                  key={index}
                  className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md"
                >
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {forecastItem.dt_txt}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${forecastItem.weather[0].icon}.png`}
                    alt={forecastItem.weather[0].description}
                    className="w-12 h-12"
                  />
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {forecastItem.main.temp}°C |{" "}
                    {forecastItem.weather[0].description}
                  </p>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
