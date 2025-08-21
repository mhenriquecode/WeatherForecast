import React from "react";

const AirQualityCard = ({ airQuality }) => {
  const aqiLabels = ["Bom", "Moderado", "Ruim", "Muito Ruim", "Péssimo"];
  const aqi = airQuality.list[0].main.aqi;

  return (
    <div className="md:col-span-3 bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold mb-2 text-center">🌍 Qualidade do Ar</h3>
      <p className="mb-4 text-center">
        AQI: {aqi} ({aqiLabels[aqi - 1]})
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-sm">
        {Object.entries(airQuality.list[0].components).map(([key, value]) => (
          <div key={key} className="bg-white/5 rounded-lg p-2 text-center shadow">
            <strong>{key.toUpperCase()}</strong>
            <div>{value} μg/m³</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualityCard;
