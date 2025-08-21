import React, { useState } from "react";
import axios from "axios";

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
    } catch {
      setAirQuality(null);
    }
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    try {
      const resWeather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&units=metric&lang=pt_br&appid=${apiKey}`
      );
      setWeather(resWeather.data);
      setError(null);

      const resForecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&units=metric&lang=pt_br&appid=${apiKey}`
      );
      setForecast(resForecast.data);

      const { lat, lon } = resWeather.data.coord;
      await fetchAirQuality(lat, lon);
    } catch {
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
      setError("Cidade não encontrada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto text-white">
      <h2 className="text-4xl font-bold mb-5 text-center">🌦️ Previsão do Tempo</h2>

      {/* Campo de busca */}
      <div className="mb-8 max-w-md mx-auto flex gap-3">
        <input
          type="text"
          value={city}
          placeholder="Digite uma cidade"
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 p-3 rounded-lg text-white text-center shadow-md"
        />
        <button
          onClick={fetchWeather}
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

      {/* Bento Grid */}
      <div className="grid gap-6 md:grid-cols-6 auto-rows-[minmax(150px,auto)]">
        {/* Clima atual */}
        {weather && (
          <div className="md:col-span-3 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex flex-col">
            <h3 className="text-xl font-semibold mb-3 text-center">
              {weather.name}, {weather.sys.country}
            </h3>
            <p className="capitalize text-center font-semibold">{weather.weather[0].description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Temperatura */}
              <div className="flex flex-col items-center mb-5">
                <h5 className="text-xl font-semibold">Temperatura</h5>
                <div>🌡️ {weather.main.temp} °C</div>
              </div>

              {/* Umidade */}
              <div className="flex flex-col items-center">
                <h5 className="text-xl font-semibold">Umidade</h5>
                <div>💧 {weather.main.humidity}%</div>
              </div>

              {/* Vento */}
              <div className="flex flex-col items-center ">
                <h5 className="text-xl font-semibold">Vento</h5>
                <div>🌬️ {(weather.wind.speed * 3.6).toFixed(1)} km/h</div>
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Ícone do clima"
                className="mx-auto items-center"
              />
            </div>
          </div>
        )}

        {/* Qualidade do ar */}
        {airQuality && (
          <div className="md:col-span-3 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-center">🌍 Qualidade do Ar</h3>
            <p className="mb-4 text-center">
              AQI: {airQuality.list[0].main.aqi}{" "}
              {
                ["(Bom)", "(Moderado)", "(Ruim)", "(Muito Ruim)", "(Péssimo)"][
                airQuality.list[0].main.aqi - 1
                ]
              }
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-sm">
              {Object.entries(airQuality.list[0].components).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white/5 rounded-lg p-2 text-center shadow"
                >
                  <strong>{key.toUpperCase()}</strong>
                  <div>{value} μg/m³</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previsão 5 dias */}
        {forecast && (
          <div className="md:col-span-6 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg overflow-hidden">
            <h3 className="text-2xl font-semibold mb-4 mx-auto text-center">📅 Previsão 5 dias</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 ">
              {forecast.list
                .filter((item) => item.dt_txt.includes("12:00:00"))
                .map((item) => (
                  <div
                    key={item.dt}
                    className="min-w-[120px] bg-white/10 rounded-xl p-4 text-center shadow-md mx-auto"
                  >
                    <h4 className="font-bold mb-1">
                      {new Date(item.dt_txt).toLocaleDateString("pt-BR", {
                        weekday: "short",
                        day: "numeric",
                        month: "numeric",
                      })}
                    </h4>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                      className="mx-auto w-12"
                    />
                    <p className="capitalize">{item.weather[0].description}</p>
                    <p className="mt-2 text-sm">🌡️ {item.main.temp.toFixed(1)} °C</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
