import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Thermometer, Globe, Bell, Palette, Info, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ToggleSwitch = ({ value, onChange, isDarkMode }) => (
  <div
    onClick={onChange}
    style={{
      width: '48px', height: '26px',
      borderRadius: '9999px',
      background: value ? '#3b82f6' : (isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.2s',
      flexShrink: 0,
    }}
  >
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%', background: 'white',
      position: 'absolute', top: '3px',
      left: value ? '25px' : '3px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    }} />
  </div>
);

const SettingRow = ({ icon: Icon, title, subtitle, children, isDarkMode }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.1rem 1.5rem',
    borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      }}>
        <Icon size={18} style={{ opacity: 0.8 }} />
      </div>
      <div>
        <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '0.78rem', opacity: 0.55, marginTop: '0.1rem' }}>{subtitle}</div>}
      </div>
    </div>
    {children}
  </div>
);

const SectionCard = ({ title, children, isDarkMode }) => (
  <div style={{ marginBottom: '1.75rem' }}>
    <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.45, marginBottom: '0.6rem', paddingLeft: '0.25rem' }}>
      {title}
    </div>
    <div style={{
      borderRadius: '1rem',
      background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  </div>
);

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [useCelsius, setUseCelsius] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [autoLocation, setAutoLocation] = useState(true);
  const [unit12h, setUnit12h] = useState(false);

  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';

  return (
    <div style={{
      width: '100%', height: '100%', overflowY: 'auto',
      padding: '2.5rem 2rem', color: textColor,
      fontFamily: "'Outfit', sans-serif",
    }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.4rem', fontFamily: "'Playfair Display', serif" }}>
          Settings
        </h1>
        <p style={{ opacity: 0.55, marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Personalise your SkyTale experience.
        </p>

        {/* Appearance */}
        <SectionCard title="Appearance" isDarkMode={isDarkMode}>
          <SettingRow icon={isDarkMode ? Moon : Sun} title="Dark Mode" subtitle="Switch between light and dark interface" isDarkMode={isDarkMode}>
            <ToggleSwitch value={isDarkMode} onChange={toggleTheme} isDarkMode={isDarkMode} />
          </SettingRow>
          <SettingRow icon={Palette} title="Atmospheric Themes" subtitle="Dynamic backgrounds based on weather condition" isDarkMode={isDarkMode}>
            <ToggleSwitch value={true} onChange={() => {}} isDarkMode={isDarkMode} />
          </SettingRow>
        </SectionCard>

        {/* Units */}
        <SectionCard title="Units & Format" isDarkMode={isDarkMode}>
          <SettingRow
            icon={Thermometer}
            title="Temperature Unit"
            subtitle={useCelsius ? 'Currently showing Celsius (°C)' : 'Currently showing Fahrenheit (°F)'}
            isDarkMode={isDarkMode}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', opacity: useCelsius ? 1 : 0.4, fontWeight: 500 }}>°C</span>
              <ToggleSwitch value={!useCelsius} onChange={() => setUseCelsius(p => !p)} isDarkMode={isDarkMode} />
              <span style={{ fontSize: '0.85rem', opacity: !useCelsius ? 1 : 0.4, fontWeight: 500 }}>°F</span>
            </div>
          </SettingRow>
          <SettingRow icon={Globe} title="Time Format" subtitle={unit12h ? '12-hour clock (AM/PM)' : '24-hour clock'} isDarkMode={isDarkMode}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', opacity: !unit12h ? 1 : 0.4 }}>24h</span>
              <ToggleSwitch value={unit12h} onChange={() => setUnit12h(p => !p)} isDarkMode={isDarkMode} />
              <span style={{ fontSize: '0.85rem', opacity: unit12h ? 1 : 0.4 }}>12h</span>
            </div>
          </SettingRow>
        </SectionCard>

        {/* Location */}
        <SectionCard title="Location" isDarkMode={isDarkMode}>
          <SettingRow icon={Globe} title="Auto-detect Location" subtitle="Use your device's GPS to find local weather" isDarkMode={isDarkMode}>
            <ToggleSwitch value={autoLocation} onChange={() => setAutoLocation(p => !p)} isDarkMode={isDarkMode} />
          </SettingRow>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" isDarkMode={isDarkMode}>
          <SettingRow icon={Bell} title="Weather Alerts" subtitle="Get notified of severe weather in your cities" isDarkMode={isDarkMode}>
            <ToggleSwitch value={notifications} onChange={() => setNotifications(p => !p)} isDarkMode={isDarkMode} />
          </SettingRow>
        </SectionCard>

        {/* About */}
        <SectionCard title="About" isDarkMode={isDarkMode}>
          <SettingRow icon={Info} title="SkyTale" subtitle="Weather Narrative App · v1.0.0" isDarkMode={isDarkMode}>
            <ChevronRight size={16} style={{ opacity: 0.35 }} />
          </SettingRow>
          <div style={{
            padding: '1rem 1.5rem',
            fontSize: '0.78rem', opacity: 0.45, lineHeight: 1.6,
          }}>
            Powered by <strong>Open-Meteo</strong> — 100% free, no API key required. 
            Map data from <strong>OpenStreetMap</strong> via CartoDB tiles.
          </div>
        </SectionCard>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
