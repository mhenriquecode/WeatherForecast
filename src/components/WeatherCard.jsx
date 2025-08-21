import React from "react";

const WeatherCard = ({ weather }) => {
  return (
    <div className="md:col-span-3 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex flex-col">
      <h3 className="text-xl font-semibold mb-3 text-center">
        {weather.name}, {weather.sys.country}
      </h3>
      <p className="capitalize text-center font-semibold">{weather.weather[0].description}</p>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col items-center mb-5">
          <h5 className="text-xl font-semibold">Temperatura</h5>
          <div>🌡️ {weather.main.temp} °C</div>
        </div>
        <div className="flex flex-col items-center">
          <h5 className="text-xl font-semibold">Umidade</h5>
          <div>💧 {weather.main.humidity}%</div>
        </div>
        <div className="flex flex-col items-center">
          <h5 className="text-xl font-semibold">Vento</h5>
          <div>🌬️ {(weather.wind.speed * 3.6).toFixed(1)} km/h</div>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="mx-auto items-center"
        />
      </div>
    </div>
  );
};

export default WeatherCard;
