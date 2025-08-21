import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  console.log('API KEY:', import.meta.env.VITE_WEATHER_API_KEY);

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
      setError('Cidade não encontrada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 max-w-4xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Previsão do Tempo</h2>

      {/* Campo de busca */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          value={city}
          placeholder="Digite uma cidade"
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 rounded text-black text-center"
        />
        <button
          onClick={fetchWeather}
          className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 transition rounded text-white font-semibold"
        >
          {loading ? 'Carregando...' : 'Buscar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white text-center p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {/* Clima atual */}
      {weather && (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-2">
            {weather.name}, {weather.sys.country}
          </h3>
          <p className="capitalize mb-4">{weather.weather[0].description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>🌡️ {weather.main.temp} °C</div>
            <div>💧 Umidade: {weather.main.humidity}%</div>
            <div>🌬️ Vento: {weather.wind.speed} km/h</div>
          </div>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Ícone do clima"
            className="mx-auto mt-4"
          />
        </div>
      )}

      {/* Previsão para 5 dias */}
      {forecast && (
        <>
          <h3 className="text-2xl font-semibold mb-4">Previsão para 5 dias</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
            {forecast.list
              .filter((item, index) => index % 8 === 0)
              .map((item) => (
                <div
                  key={item.dt}
                  className="min-w-[150px] bg-white/10 backdrop-blur-md rounded-lg p-4 text-center flex-shrink-0"
                >
                  <h4 className="text-sm font-bold mb-2">
                    {new Date(item.dt_txt).toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'numeric',
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
        </>
      )}

      {/* Qualidade do ar */}
      {airQuality && (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Qualidade do Ar</h3>
          <p className="mb-4">
            AQI: {airQuality.list[0].main.aqi}{' '}
            {['(Bom)', '(Moderado)', '(Ruim)', '(Muito Ruim)', '(Péssimo)'][airQuality.list[0].main.aqi - 1]}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {Object.entries(airQuality.list[0].components).map(([key, value]) => (
              <div key={key}>
                <strong>{key.toUpperCase()}:</strong> {value} μg/m³
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
