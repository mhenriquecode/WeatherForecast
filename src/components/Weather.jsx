import React, { useState } from "react";
import axios from "axios";
import WeatherCard from "./WeatherCard.jsx";
import AirQualityCard from "./AirQualityCard.jsx";
import ForecastCard from "./ForecastCard.jsx";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchAirQuality = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      setAirQuality(res.data);
    } catch (err) {
      console.error("Erro ao buscar AQI:", err);
      setAirQuality(null);
    }
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resWeather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&units=metric&lang=pt_br&appid=${apiKey}`
      );
      setWeather(resWeather.data);

      const resForecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&units=metric&lang=pt_br&appid=${apiKey}`
      );
      setForecast(resForecast.data);

      const { lat, lon } = resWeather.data.coord;
      await fetchAirQuality(lat, lon);
    } catch (err) {
      console.error("Erro ao buscar dados do clima:", err);
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
      setError("Cidade não encontrada ou erro na API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto text-white">
      <h2 className="text-4xl font-bold mb-5 text-center">🌦️ Previsão do Tempo</h2>

      <div className="mb-8 max-w-md mx-auto flex gap-3">
        <input
          type="text"
          aria-label="Digite a cidade"
          value={city}
          placeholder="Digite uma cidade"
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 p-3 rounded-lg text-white text-center shadow-md"
        />
        <button
          onClick={fetchWeather}
          aria-label="Buscar clima da cidade"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-semibold shadow-md"
        >
          {loading ? "Carregando..." : "Buscar"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white text-center p-3 mb-6 rounded-lg shadow-md">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-6 auto-rows-[minmax(150px,auto)]">
        {weather && <WeatherCard weather={weather} />}
        {airQuality && <AirQualityCard airQuality={airQuality} />}
        {forecast && (
          <div className="md:col-span-6 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg overflow-hidden">
            <h3 className="text-2xl font-semibold mb-4 mx-auto text-center">📅 Previsão 5 dias</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {forecast.list
                .filter((item) => item.dt_txt.includes("12:00:00"))
                .map((item) => (
                  <ForecastCard key={item.dt} forecast={item} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
