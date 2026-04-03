import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Sun, Moon, Map, Settings, Cloud, Building2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV = [
  { to: '/',        icon: Cloud,      label: 'Weather'  },
  { to: '/cities',  icon: Building2,  label: 'Cities'   },
  { to: '/maps',    icon: Map,        label: 'Map'      },
  { to: '/settings',icon: Settings,   label: 'Settings' },
];

const Layout = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const sidebarBg    = isDarkMode ? '#111827' : '#1e293b';
  const activeBg     = isDarkMode ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.15)';
  const activeColor  = '#3B82F6';
  const mutedColor   = isDarkMode ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.55)';
  const hoverBg      = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)';

  const mainBg       = isDarkMode ? '#111827' : '#F1F5F9';

  return (
    <div style={{ display:'flex', width:'100vw', height:'100vh', overflow:'hidden', fontFamily:"'Outfit',sans-serif" }}>
      {/* ── Sidebar ── */}
      <nav style={{
        width: '80px',
        minWidth: '80px',
        height: '100%',
        background: sidebarBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '28px',
        paddingBottom: '24px',
        gap: '0',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 40,
        transition: 'background 0.3s',
      }}>
        {/* Brand */}
        <div style={{ marginBottom: '32px', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
          <Cloud size={28} color={activeColor} strokeWidth={1.8} />
          <span style={{ fontSize:'.50rem', letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)', fontWeight:600, textAlign:'center' }}>
            Sky Tale
          </span>
        </div>

        {/* Nav links */}
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '5px', padding: '10px 8px', width: '56px', borderRadius: '14px',
              marginBottom: '6px', textDecoration: 'none', cursor: 'pointer',
              color: isActive ? activeColor : mutedColor,
              background: isActive ? activeBg : 'transparent',
              transition: 'all 0.2s',
            })}
            onMouseOver={e => {
              if (!e.currentTarget.classList.contains('active'))
                e.currentTarget.style.background = hoverBg;
            }}
            onMouseOut={e => {
              const isActive = window.location.pathname === to || (to === '/' && window.location.pathname === '/');
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon size={22} strokeWidth={1.8} />
            <span style={{ fontSize: '.6rem', fontWeight: 500, letterSpacing: '.05em', textTransform:'uppercase' }}>
              {label}
            </span>
          </NavLink>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            width: '46px', height: '46px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: isDarkMode ? '#FCD34D' : '#C4B5FD',
            transition: 'all 0.2s',
          }}
        >
          {isDarkMode ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
        </button>
      </nav>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, height: '100%', overflow: 'hidden', background: mainBg, transition: 'background 0.3s' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
