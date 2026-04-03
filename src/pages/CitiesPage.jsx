import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trash2, Plus, Wind, Droplets, Thermometer, Star } from 'lucide-react';
import { fetchWeather, getWeatherDescription, searchLocation } from '../utils/weatherAPI';
import { useTheme } from '../context/ThemeContext';

const DEFAULT_CITIES = [
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
];

const CityCard = ({ city, onRemove, isDarkMode }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather(city.lat, city.lon).then(data => {
      setWeather(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [city]);

  const bg = isDarkMode
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(0,0,0,0.04)';
  const border = isDarkMode
    ? '1px solid rgba(255,255,255,0.1)'
    : '1px solid rgba(0,0,0,0.08)';

  const weatherInfo = weather ? getWeatherDescription(weather.current.weather_code, weather.current.is_day) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        background: bg,
        border,
        backdropFilter: 'blur(12px)',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Remove button */}
      {onRemove && (
        <button
          onClick={() => onRemove(city.name)}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'rgba(239,68,68,0.15)', border: 'none',
            borderRadius: '50%', padding: '0.4rem',
            cursor: 'pointer', color: '#ef4444', display: 'flex',
          }}
        >
          <Trash2 size={14} />
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
        <MapPin size={16} />
        <span style={{ fontWeight: 500, fontSize: '1rem' }}>{city.name}</span>
        {city.isDefault && <Star size={12} fill="currentColor" style={{ color: '#f59e0b' }} />}
      </div>

      {loading ? (
        <div style={{ opacity: 0.5, fontSize: '0.875rem' }}>Loading weather…</div>
      ) : weather ? (
        <>
          <div style={{ fontSize: '3rem', fontWeight: 300, lineHeight: 1 }}>
            {Math.round(weather.current.temperature_2m)}°
          </div>
          <div style={{ opacity: 0.7, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {weatherInfo?.txt}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', opacity: 0.75, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <Wind size={14} /> {Math.round(weather.current.wind_speed_10m)} km/h
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <Droplets size={14} /> {weather.current.relative_humidity_2m}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <Thermometer size={14} /> Feels {Math.round(weather.current.apparent_temperature)}°
            </div>
          </div>
        </>
      ) : (
        <div style={{ opacity: 0.5, fontSize: '0.875rem' }}>Unable to load weather</div>
      )}
    </motion.div>
  );
};

const CitiesPage = () => {
  const { isDarkMode } = useTheme();
  const [cities, setCities] = useState(DEFAULT_CITIES.map(c => ({ ...c, isDefault: true })));
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const results = await searchLocation(query);
      setSearchResults(results.slice(0, 4));
      setSearching(false);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const addCity = (loc) => {
    if (cities.find(c => c.name === loc.name)) return;
    setCities(prev => [...prev, { name: loc.name, lat: loc.latitude, lon: loc.longitude }]);
    setQuery('');
    setSearchResults([]);
  };

  const removeCity = (name) => {
    setCities(prev => prev.filter(c => c.name !== name));
  };

  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const inputBg = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
  const inputBorder = isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)';
  const dropdownBg = isDarkMode ? '#1e293b' : '#fff';
  const dropdownBorder = isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)';

  return (
    <div
      style={{
        width: '100%', height: '100%', overflowY: 'auto', padding: '2.5rem',
        color: textColor, fontFamily: "'Outfit', sans-serif",
      }}
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.4rem', fontFamily: "'Playfair Display', serif" }}>
          My Cities
        </h1>
        <p style={{ opacity: 0.6, marginBottom: '2rem', fontSize: '1rem' }}>
          Track weather across your favourite cities in India and worldwide.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '2.5rem', maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: inputBg, border: inputBorder, borderRadius: '0.875rem', padding: '0.75rem 1.2rem' }}>
            <Plus size={18} style={{ opacity: 0.5 }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Add a city…"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '1rem', color: textColor, fontFamily: "'Outfit', sans-serif",
              }}
            />
          </div>
          {(searchResults.length > 0 || searching) && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, right: 0,
              background: dropdownBg, border: dropdownBorder, borderRadius: '0.875rem',
              padding: '0.5rem', zIndex: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}>
              {searching && <div style={{ padding: '0.75rem 1rem', opacity: 0.5, fontSize: '0.875rem' }}>Searching…</div>}
              {searchResults.map(r => (
                <div key={r.id}
                  onClick={() => addCity(r)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem', borderRadius: '0.625rem', cursor: 'pointer',
                    transition: 'background 0.15s', fontSize: '0.9rem',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(125,125,125,0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={14} style={{ opacity: 0.6 }} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{r.name}</div>
                    <div style={{ opacity: 0.5, fontSize: '0.75rem' }}>{r.admin1 ? `${r.admin1}, ` : ''}{r.country}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {cities.map(city => (
            <CityCard
              key={city.name}
              city={city}
              onRemove={!city.isDefault ? removeCity : null}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CitiesPage;
