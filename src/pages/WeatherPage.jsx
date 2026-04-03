import React, { useState, useEffect } from 'react';
import WeatherDashboard from '../components/WeatherDashboard';
import { fetchWeather } from '../utils/weatherAPI';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({ name: 'Mumbai', lat: 19.0760, lon: 72.8777 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeather(location.lat, location.lon);
        setWeatherData(data);
      } catch (err) {
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, [location]);

  const handleCitySelect = (result) => {
    setLocation({ name: result.name, lat: result.latitude, lon: result.longitude });
  };

  if (loading && !weatherData) {
    return (
      <div style={{
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem',
        letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.55,
      }}>
        Reading the skies…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: '#ef4444',
        fontFamily: "'Outfit', sans-serif",
      }}>
        {error}
      </div>
    );
  }

  return (
    <WeatherDashboard
      data={weatherData}
      locationName={location.name}
      onSearchClick={handleCitySelect}
    />
  );
};

export default WeatherPage;
