import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake, Moon, Wind, MapPin, Search } from 'lucide-react';
import { getWeatherDescription, generateStory } from '../utils/weatherAPI';

const WeatherStory = ({ data, locationName, onSearchClick }) => {
  if (!data || !data.current) return null;

  const { current } = data;
  const isDay = current.is_day === 1;
  const weatherInfo = getWeatherDescription(current.weather_code, isDay);
  const storyText = generateStory(data, locationName);

  // Pick primary icon
  const renderBigIcon = () => {
    const props = { size: 120, className: "weather-icon drop-shadow-2xl opacity-90", strokeWidth: 1.5 };
    switch (weatherInfo.icon) {
      case 'sun': return <Sun {...props} color="#fbbf24" />;
      case 'moon': return <Moon {...props} color="#cbd5e1" />;
      case 'cloud': return <Cloud {...props} color="#e2e8f0" />;
      case 'cloud-sun': return <Cloud {...props} color="#fcd34d" />;
      case 'cloud-moon': return <Cloud {...props} color="#94a3b8" />;
      case 'cloud-rain': return <CloudRain {...props} color="#60a5fa" />;
      case 'cloud-snow': return <Snowflake {...props} color="#e0f2fe" />;
      case 'cloud-lightning': return <CloudLightning {...props} color="#a78bfa" />;
      default: return <Cloud {...props} />;
    }
  };

  const getThemeVars = () => {
    // Return different gradient styles based on the weather
    if (!isDay) return "night-theme";
    if (current.weather_code >= 50 && current.weather_code < 70) return "rain-theme";
    if (current.weather_code >= 70 && current.weather_code < 80) return "snow-theme";
    if (current.weather_code >= 90) return "storm-theme";
    if (current.weather_code > 1 && current.weather_code < 4) return "cloudy-theme";
    return "sunny-theme";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 1.5, staggerChildren: 0.3 }
    },
    exit: { opacity: 0, transition: { duration: 0.8 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={locationName + current.weather_code}
        className={`weather-app-container ${getThemeVars()}`}
        style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="noise-overlay" />
        
        <header className="app-header flex justify-between items-center p-6 sm:p-12 relative z-10 w-full max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="location-pill flex items-center gap-2 px-4 py-2 rounded-full glass-panel cursor-pointer" onClick={onSearchClick}>
            <MapPin size={18} />
            <span className="font-medium tracking-wide uppercase text-sm">{locationName}</span>
            <Search size={14} className="ml-2 opacity-50" />
          </motion.div>
          <motion.div variants={itemVariants} className="text-right glass-panel px-5 py-2 rounded-2xl">
            <div className="text-4xl sm:text-5xl font-light tabular-nums">{Math.round(current.temperature_2m)}°</div>
            <div className="text-sm font-medium uppercase tracking-widest opacity-80 mt-1">{weatherInfo.txt}</div>
          </motion.div>
        </header>

        <main className="story-content flex flex-col justify-center items-center text-center flex-1 px-6 relative z-10 w-full max-w-4xl mx-auto" style={{ minHeight: '60vh' }}>
          <motion.div 
            variants={itemVariants} 
            className="icon-wrapper mb-12"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            {renderBigIcon()}
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="narrative-text text-3xl sm:text-5xl md:text-6xl font-serif leading-tight sm:leading-snug"
          >
            {storyText}
          </motion.h1>

          <motion.div variants={itemVariants} className="details-grid mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
             <div className="detail-card glass-panel rounded-2xl p-6 flex flex-col items-center">
                <Wind className="mb-3 opacity-70" size={24} />
                <span className="text-sm uppercase tracking-widest opacity-60 mb-1">Wind</span>
                <span className="text-xl font-light">{Math.round(current.wind_speed_10m)} km/h</span>
             </div>
             <div className="detail-card glass-panel rounded-2xl p-6 flex flex-col items-center">
                <CloudRain className="mb-3 opacity-70" size={24} />
                <span className="text-sm uppercase tracking-widest opacity-60 mb-1">Precipitation</span>
                <span className="text-xl font-light">{current.precipitation} mm</span>
             </div>
             <div className="detail-card glass-panel rounded-2xl p-6 flex flex-col items-center">
                <Cloud className="mb-3 opacity-70" size={24} />
                <span className="text-sm uppercase tracking-widest opacity-60 mb-1">Cloud Cover</span>
                <span className="text-xl font-light">{current.cloud_cover}%</span>
             </div>
             <div className="detail-card glass-panel rounded-2xl p-6 flex flex-col items-center">
                <Sun className="mb-3 opacity-70" size={24} />
                <span className="text-sm uppercase tracking-widest opacity-60 mb-1">Humidity</span>
                <span className="text-xl font-light">{current.relative_humidity_2m}%</span>
             </div>
          </motion.div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherStory;
