import React from "react";

const ForecastCard = ({ forecast }) => {
  return (
    <div className="min-w-[120px] bg-white/10 rounded-xl p-4 text-center shadow-md mx-auto">
      <h4 className="font-bold mb-1">
        {new Date(forecast.dt_txt).toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "numeric",
          month: "numeric",
        })}
      </h4>
      <img
        src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
        alt={forecast.weather[0].description}
        className="mx-auto w-12"
      />
      <p className="capitalize">{forecast.weather[0].description}</p>
      <p className="mt-2 text-sm">🌡️ {forecast.main.temp.toFixed(1)} °C</p>
    </div>
  );
};

export default ForecastCard;
