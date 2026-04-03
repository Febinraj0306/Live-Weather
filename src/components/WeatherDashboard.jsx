import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Wind, Droplets, Thermometer, Eye,
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Moon, CloudDrizzle,
  ChevronRight
} from 'lucide-react';
import { getWeatherDescription } from '../utils/weatherAPI';
import { searchLocation } from '../utils/weatherAPI';

/* ─── Weather Icon Component ─── */
const WeatherIcon = ({ code, isDay = 1, size = 28, animated = false }) => {
  const info = getWeatherDescription(code, isDay);
  const style = animated ? { animation: 'floatIcon 5s ease-in-out infinite' } : {};
  const props = { size, strokeWidth: 1.5, style };

  switch (info.icon) {
    case 'sun':            return <Sun {...props} color="#FBBF24" />;
    case 'moon':           return <Moon {...props} color="#C4B5FD" />;
    case 'cloud-sun':      return <Cloud {...props} color="#FCD34D" />;
    case 'cloud-moon':     return <Cloud {...props} color="#94A3B8" />;
    case 'cloud':          return <Cloud {...props} color="#CBD5E1" />;
    case 'cloud-rain':     return <CloudRain {...props} color="#60A5FA" />;
    case 'cloud-drizzle':  return <CloudDrizzle {...props} color="#93C5FD" />;
    case 'cloud-snow':     return <CloudSnow {...props} color="#E0F2FE" />;
    case 'cloud-lightning':return <CloudLightning {...props} color="#A78BFA" />;
    default:               return <Sun {...props} color="#FBBF24" />;
  }
};

/* ─── Format hour label ─── */
const fmtHour = (isoStr) => {
  const d = new Date(isoStr);
  const h = d.getHours();
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
};

const fmtDay = (isoStr) => {
  const d = new Date(isoStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

/* ─── Main Component ─── */
const WeatherDashboard = ({ data, locationName, onSearchClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  if (!data?.current) return null;

  const { current, hourly, daily } = data;
  const isDay = current.is_day === 1;
  const info = getWeatherDescription(current.weather_code, isDay);

  /* pick 6 upcoming hours */
  const now = new Date();
  const nowHour = now.getHours();
  const hourSlots = hourly?.time
    ?.map((t, i) => ({
      time: t, temp: Math.round(hourly.temperature_2m[i]),
      code: hourly.weather_code[i], rain: hourly.precipitation_probability[i],
    }))
    .filter(h => {
      const hh = new Date(h.time).getHours();
      const hDate = new Date(h.time).toDateString();
      return hDate === now.toDateString() && (hh === 6 || hh === 9 || hh === 12 || hh === 15 || hh === 18 || hh === 21);
    })
    .slice(0, 6) ?? [];

  /* 7-day */
  const days = daily?.time?.slice(0, 7).map((d, i) => ({
    day: i === 0 ? 'Today' : fmtDay(d),
    code: daily.weather_code[i],
    high: Math.round(daily.temperature_2m_max[i]),
    low:  Math.round(daily.temperature_2m_min[i]),
    txt:  getWeatherDescription(daily.weather_code[i], 1).txt,
  })) ?? [];

  /* search */
  const handleSearch = async (q) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    const res = await searchLocation(q).catch(() => []);
    setResults(res.slice(0, 5));
    setSearching(false);
  };

  const uvMax = daily?.uv_index_max?.[0] ?? current.uv_index ?? '—';

  return (
    <div className="wd-root">
      <style>{`
        @keyframes floatIcon {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)}
        }
        .wd-root {
          width:100%; height:100%; overflow:hidden;
          display:grid;
          grid-template-columns:1fr 280px;
          grid-template-rows:auto 1fr;
          gap:0;
          background: var(--wd-bg);
          color: var(--wd-text);
          font-family:'Outfit',sans-serif;
        }
        /* ── CSS variables per theme ── */
        .dark-mode .wd-root, .wd-root {
          --wd-bg:#111827;
          --wd-surface:#1F2937;
          --wd-surface2:#374151;
          --wd-border:rgba(255,255,255,0.07);
          --wd-text:#F9FAFB;
          --wd-muted:#9CA3AF;
          --wd-accent:#3B82F6;
          --wd-card:#1F2937;
        }
        .light-mode .wd-root {
          --wd-bg:#F1F5F9;
          --wd-surface:#FFFFFF;
          --wd-surface2:#E2E8F0;
          --wd-border:rgba(0,0,0,0.07);
          --wd-text:#0F172A;
          --wd-muted:#64748B;
          --wd-accent:#3B82F6;
          --wd-card:#FFFFFF;
        }

        /* ── Search bar ── */
        .wd-search-bar {
          grid-column:1/3;
          padding:18px 24px 0;
          position:relative;
        }
        .wd-search-input-wrap {
          display:flex; align-items:center; gap:10px;
          background:var(--wd-surface); border:1px solid var(--wd-border);
          border-radius:12px; padding:10px 18px;
          max-width:440px; cursor:pointer;
        }
        .wd-search-input {
          flex:1; background:transparent; border:none; outline:none;
          font-size:0.95rem; color:var(--wd-text); font-family:'Outfit',sans-serif;
        }
        .wd-search-input::placeholder { color:var(--wd-muted); }
        .wd-dropdown {
          position:absolute; top:calc(100% + 8px); left:24px;
          width:440px; background:var(--wd-surface);
          border:1px solid var(--wd-border); border-radius:14px;
          overflow:hidden; z-index:100; box-shadow:0 8px 30px rgba(0,0,0,0.35);
        }
        .wd-dropdown-item {
          display:flex; align-items:center; gap:12px;
          padding:12px 18px; cursor:pointer; transition:background .15s;
        }
        .wd-dropdown-item:hover { background:var(--wd-surface2); }

        /* ── Left panel ── */
        .wd-left {
          padding:20px 24px 20px;
          overflow-y:auto;
          display:flex; flex-direction:column; gap:16px;
        }

        /* ── Hero ── */
        .wd-hero {
          background:var(--wd-card); border:1px solid var(--wd-border);
          border-radius:20px; padding:24px;
          display:flex; align-items:center; justify-content:space-between;
        }
        .wd-hero-left h1 {
          font-size:2.4rem; font-weight:300;
          font-family:'Playfair Display',serif; margin-bottom:2px;
        }
        .wd-hero-left .wd-condition { font-size:.85rem; color:var(--wd-muted); margin-bottom:16px; }
        .wd-hero-left .wd-temp { font-size:4rem; font-weight:200; line-height:1; }
        .wd-hero-icon { opacity:.95; }

        /* ── Section label ── */
        .wd-label {
          font-size:.7rem; font-weight:600; letter-spacing:.12em;
          text-transform:uppercase; color:var(--wd-muted); margin-bottom:10px;
        }

        /* ── Hourly strip ── */
        .wd-card { background:var(--wd-card); border:1px solid var(--wd-border); border-radius:20px; padding:20px; }
        .wd-hourly-grid {
          display:grid; grid-template-columns:repeat(6,1fr); gap:8px;
        }
        .wd-hour-cell {
          display:flex; flex-direction:column; align-items:center; gap:8px;
          padding:14px 8px; border-radius:14px; background:var(--wd-surface2);
          font-size:.82rem;
        }
        .wd-hour-cell .time { color:var(--wd-muted); font-size:.75rem; }
        .wd-hour-cell .temp { font-weight:500; font-size:.95rem; }

        /* ── Air conditions ── */
        .wd-air-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:12px;
        }
        .wd-air-item {
          background:var(--wd-surface2); border-radius:14px;
          padding:16px; display:flex; flex-direction:column; gap:6px;
        }
        .wd-air-item .label { font-size:.72rem; color:var(--wd-muted); display:flex; align-items:center; gap:6px; }
        .wd-air-item .value { font-size:1.4rem; font-weight:300; }

        /* ── Right panel: 7-day ── */
        .wd-right {
          background:var(--wd-surface); border-left:1px solid var(--wd-border);
          overflow-y:auto; padding:20px 18px;
          display:flex; flex-direction:column; gap:0;
        }
        .wd-right .wd-label { margin-bottom:14px; }
        .wd-day-row {
          display:flex; align-items:center;
          padding:12px 8px; border-radius:12px;
          cursor:default; transition:background .15s;
          gap:10px;
        }
        .wd-day-row:hover { background:var(--wd-surface2); }
        .wd-day-row .day { width:38px; font-size:.85rem; color:var(--wd-muted); }
        .wd-day-row .cond { flex:1; font-size:.82rem; }
        .wd-day-row .temps { font-size:.9rem; font-weight:500; white-space:nowrap; }
        .wd-day-row .temps span { color:var(--wd-muted); font-weight:400; margin-left:4px; font-size:.82rem; }

        /* scrollbar */
        .wd-left::-webkit-scrollbar, .wd-right::-webkit-scrollbar { width:5px; }
        .wd-left::-webkit-scrollbar-track, .wd-right::-webkit-scrollbar-track { background:transparent; }
        .wd-left::-webkit-scrollbar-thumb, .wd-right::-webkit-scrollbar-thumb { background:var(--wd-border); border-radius:99px; }
      `}</style>

      {/* ── Search Bar ── */}
      <div className="wd-search-bar" style={{ gridColumn: '1/3' }}>
        <div className="wd-search-input-wrap" onClick={() => setSearchOpen(true)}>
          <Search size={16} color="var(--wd-muted)" />
          <input
            className="wd-search-input"
            placeholder="Search for cities"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setSearchOpen(true)}
          />
          {locationName && (
            <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'.8rem', color:'var(--wd-muted)' }}>
              <MapPin size={13} /> {locationName}
            </span>
          )}
        </div>

        <AnimatePresence>
          {searchOpen && (results.length > 0 || searching) && (
            <motion.div
              className="wd-dropdown"
              initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
            >
              {searching && <div style={{ padding:'12px 18px', color:'var(--wd-muted)', fontSize:'.85rem' }}>Searching…</div>}
              {results.map(r => (
                <div key={r.id} className="wd-dropdown-item"
                  onClick={() => { onSearchClick(r); setSearchOpen(false); setQuery(''); setResults([]); }}
                >
                  <MapPin size={15} color="var(--wd-muted)" />
                  <div>
                    <div style={{ fontWeight:500, fontSize:'.9rem' }}>{r.name}</div>
                    <div style={{ fontSize:'.75rem', color:'var(--wd-muted)' }}>{r.admin1 ? `${r.admin1}, ` : ''}{r.country}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {searchOpen && <div style={{ position:'fixed', inset:0, zIndex:99 }} onClick={() => setSearchOpen(false)} />}
      </div>

      {/* ── Left Panel ── */}
      <motion.div className="wd-left" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.6 }}>

        {/* Hero Card */}
        <div className="wd-hero">
          <div className="wd-hero-left">
            <h1>{locationName}</h1>
            <div className="wd-condition">
              Chance of rain: {current.precipitation ?? 0}%
            </div>
            <div className="wd-temp">{Math.round(current.temperature_2m)}°</div>
          </div>
          <motion.div
            className="wd-hero-icon"
            animate={{ y:[0,-12,0] }} transition={{ repeat:Infinity, duration:5, ease:'easeInOut' }}
          >
            <WeatherIcon code={current.weather_code} isDay={current.is_day} size={110} />
          </motion.div>
        </div>

        {/* Today's Hourly Forecast */}
        <div className="wd-card">
          <div className="wd-label">Today's Forecast</div>
          <div className="wd-hourly-grid">
            {hourSlots.length > 0 ? hourSlots.map((h, i) => (
              <motion.div
                key={i} className="wd-hour-cell"
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.07 }}
              >
                <span className="time">{fmtHour(h.time)}</span>
                <WeatherIcon code={h.code} size={26} />
                <span className="temp">{h.temp}°</span>
              </motion.div>
            )) : (
              <div style={{ gridColumn:'1/7', color:'var(--wd-muted)', fontSize:'.85rem' }}>
                Hourly data unavailable
              </div>
            )}
          </div>
        </div>

        {/* Air Conditions */}
        <div className="wd-card">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div className="wd-label" style={{ margin:0 }}>Air Conditions</div>
            <button 
              onClick={() => window.location.href = '/details'}
              style={{ fontSize:'.72rem', background:'var(--wd-accent)', color:'#fff', border:'none', borderRadius:'99px', padding:'4px 12px', cursor:'pointer', fontFamily:'inherit' }}
            >
              See more
            </button>
          </div>
          <div className="wd-air-grid">
            <div className="wd-air-item">
              <div className="label"><Thermometer size={13} /> Real Feel</div>
              <div className="value">{Math.round(current.apparent_temperature)}°</div>
            </div>
            <div className="wd-air-item">
              <div className="label"><Wind size={13} /> Wind</div>
              <div className="value">{current.wind_speed_10m.toFixed(1)} km/h</div>
            </div>
            <div className="wd-air-item">
              <div className="label"><Droplets size={13} /> Chance of Rain</div>
              <div className="value">{current.precipitation ?? 0}%</div>
            </div>
            <div className="wd-air-item">
              <div className="label"><Eye size={13} /> UV Index</div>
              <div className="value">{uvMax}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Right Panel: 7-Day ── */}
      <motion.div className="wd-right" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:.6 }}>
        <div className="wd-label">7-Day Forecast</div>
        {days.map((d, i) => (
          <motion.div key={i} className="wd-day-row"
            initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="day">{d.day}</div>
            <WeatherIcon code={d.code} size={22} />
            <div className="cond">{d.txt}</div>
            <div className="temps">{d.high}°<span>/{d.low}°</span></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WeatherDashboard;
