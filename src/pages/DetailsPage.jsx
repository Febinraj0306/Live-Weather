import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wind, Gauge, Droplets, Sun, Cloud, CloudRain } from 'lucide-react';
import { fetchWeather } from '../utils/weatherAPI';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const DetailCard = ({ icon: Icon, title, value, unit, desc, isDarkMode }) => {
  const bg = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const border = isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)';

  return (
    <div style={{
      background: bg, border, borderRadius: '1.25rem', padding: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
        <Icon size={16} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</span>
      </div>
      <div>
        <span style={{ fontSize: '2rem', fontWeight: 300 }}>{value}</span>
        <span style={{ fontSize: '1rem', opacity: 0.7, marginLeft: '4px' }}>{unit}</span>
      </div>
      {desc && <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: 'auto', paddingTop: '0.5rem' }}>{desc}</div>}
    </div>
  );
};

const DetailsPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoding default location (Mumbai) for the details page if global state is unavailable.
  // In a robust app, we'd pass this via context or location state.
  useEffect(() => {
    fetchWeather(19.0760, 72.8777).then(res => {
      setData(res.current);
      setLoading(false);
    });
  }, []);

  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';

  if (loading || !data) return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor }}>
      Loading detailed metrics…
    </div>
  );

  return (
    <div style={{
      width: '100%', height: '100%', overflowY: 'auto', padding: '2.5rem 2rem', color: textColor,
      fontFamily: "'Outfit', sans-serif",
    }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent',
            border: 'none', color: textColor, opacity: 0.6, cursor: 'pointer', marginBottom: '2rem',
            fontFamily: 'inherit', fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.4rem', fontFamily: "'Playfair Display', serif" }}>
          Extended Conditions
        </h1>
        <p style={{ opacity: 0.55, marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Deep dive into the current atmospheric metrics.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <DetailCard icon={Wind} title="Wind Gusts" value={data.wind_gusts_10m} unit="km/h" desc={`Wind direction: ${data.wind_direction_10m}°`} isDarkMode={isDarkMode} />
          <DetailCard icon={Gauge} title="Pressure" value={data.surface_pressure} unit="hPa" desc={`Sea level: ${data.pressure_msl} hPa`} isDarkMode={isDarkMode} />
          <DetailCard icon={Cloud} title="Cloud Cover" value={data.cloud_cover} unit="%" desc="Percentage of sky covered by clouds" isDarkMode={isDarkMode} />
          <DetailCard icon={Droplets} title="Humidity" value={data.relative_humidity_2m} unit="%" desc="Relative moisture in the air" isDarkMode={isDarkMode} />
          <DetailCard icon={CloudRain} title="Precipitation" value={data.precipitation} unit="mm" desc="Rain or showers expected" isDarkMode={isDarkMode} />
          <DetailCard icon={Sun} title="UV Index" value={data.uv_index || 'Moderate'} unit="" desc="Sun exposure risk" isDarkMode={isDarkMode} />
        </div>
      </motion.div>
    </div>
  );
};

export default DetailsPage;
