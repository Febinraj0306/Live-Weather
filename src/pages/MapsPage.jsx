import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { useTheme } from '../context/ThemeContext';

// Fix leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createCustomIcon = (color = '#3b82f6') => L.divIcon({
  className: '',
  html: `<div style="
    width: 14px; height: 14px;
    background: ${color};
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

const capitalIcon = createCustomIcon('#f59e0b');   // state capitals – amber
const cityIcon    = createCustomIcon('#3b82f6');   // major cities  – blue
const UTIcon      = createCustomIcon('#a78bfa');   // union territories – purple

const INDIA_STATE_CAPITALS = [
  // States
  { name: 'Andhra Pradesh', capital: 'Amaravati',        lat: 16.5193, lon: 80.5170, type: 'capital' },
  { name: 'Arunachal Pradesh', capital: 'Itanagar',      lat: 27.0844, lon: 93.6053, type: 'capital' },
  { name: 'Assam', capital: 'Dispur',                    lat: 26.1445, lon: 91.7362, type: 'capital' },
  { name: 'Bihar', capital: 'Patna',                     lat: 25.5941, lon: 85.1376, type: 'capital' },
  { name: 'Chhattisgarh', capital: 'Raipur',             lat: 21.2514, lon: 81.6296, type: 'capital' },
  { name: 'Goa', capital: 'Panaji',                      lat: 15.4909, lon: 73.8278, type: 'capital' },
  { name: 'Gujarat', capital: 'Gandhinagar',             lat: 23.2156, lon: 72.6369, type: 'capital' },
  { name: 'Haryana', capital: 'Chandigarh',              lat: 30.7333, lon: 76.7794, type: 'capital' },
  { name: 'Himachal Pradesh', capital: 'Shimla',         lat: 31.1048, lon: 77.1734, type: 'capital' },
  { name: 'Jharkhand', capital: 'Ranchi',                lat: 23.3441, lon: 85.3096, type: 'capital' },
  { name: 'Karnataka', capital: 'Bangalore',             lat: 12.9716, lon: 77.5946, type: 'capital' },
  { name: 'Kerala', capital: 'Thiruvananthapuram',       lat: 8.5241,  lon: 76.9366, type: 'capital' },
  { name: 'Madhya Pradesh', capital: 'Bhopal',           lat: 23.2599, lon: 77.4126, type: 'capital' },
  { name: 'Maharashtra', capital: 'Mumbai',              lat: 19.0760, lon: 72.8777, type: 'capital' },
  { name: 'Manipur', capital: 'Imphal',                  lat: 24.8170, lon: 93.9368, type: 'capital' },
  { name: 'Meghalaya', capital: 'Shillong',              lat: 25.5788, lon: 91.8933, type: 'capital' },
  { name: 'Mizoram', capital: 'Aizawl',                  lat: 23.7307, lon: 92.7173, type: 'capital' },
  { name: 'Nagaland', capital: 'Kohima',                 lat: 25.6751, lon: 94.1086, type: 'capital' },
  { name: 'Odisha', capital: 'Bhubaneswar',              lat: 20.2961, lon: 85.8245, type: 'capital' },
  { name: 'Punjab', capital: 'Chandigarh',               lat: 30.7333, lon: 76.7794, type: 'capital' },
  { name: 'Rajasthan', capital: 'Jaipur',                lat: 26.9124, lon: 75.7873, type: 'capital' },
  { name: 'Sikkim', capital: 'Gangtok',                  lat: 27.3389, lon: 88.6065, type: 'capital' },
  { name: 'Tamil Nadu', capital: 'Chennai',              lat: 13.0827, lon: 80.2707, type: 'capital' },
  { name: 'Telangana', capital: 'Hyderabad',             lat: 17.3850, lon: 78.4867, type: 'capital' },
  { name: 'Tripura', capital: 'Agartala',                lat: 23.8315, lon: 91.2868, type: 'capital' },
  { name: 'Uttar Pradesh', capital: 'Lucknow',           lat: 26.8467, lon: 80.9462, type: 'capital' },
  { name: 'Uttarakhand', capital: 'Dehradun',            lat: 30.3165, lon: 78.0322, type: 'capital' },
  { name: 'West Bengal', capital: 'Kolkata',             lat: 22.5726, lon: 88.3639, type: 'capital' },
  // Union Territories
  { name: 'Andaman & Nicobar Islands', capital: 'Port Blair', lat: 11.6234, lon: 92.7265, type: 'ut' },
  { name: 'Chandigarh', capital: 'Chandigarh',           lat: 30.7333, lon: 76.7794, type: 'ut' },
  { name: 'Dadra & Nagar Haveli', capital: 'Daman',      lat: 20.3974, lon: 72.8328, type: 'ut' },
  { name: 'Delhi', capital: 'New Delhi',                  lat: 28.6139, lon: 77.2090, type: 'ut' },
  { name: 'Jammu & Kashmir', capital: 'Srinagar',        lat: 34.0837, lon: 74.7973, type: 'ut' },
  { name: 'Ladakh', capital: 'Leh',                      lat: 34.1526, lon: 77.5771, type: 'ut' },
  { name: 'Lakshadweep', capital: 'Kavaratti',           lat: 10.5669, lon: 72.6420, type: 'ut' },
  { name: 'Puducherry', capital: 'Puducherry',           lat: 11.9416, lon: 79.8083, type: 'ut' },
  // Major Metro Cities
  { name: 'Ahmedabad',  lat: 23.0225, lon: 72.5714, type: 'city' },
  { name: 'Surat',      lat: 21.1702, lon: 72.8311, type: 'city' },
  { name: 'Pune',       lat: 18.5204, lon: 73.8567, type: 'city' },
  { name: 'Nagpur',     lat: 21.1458, lon: 79.0882, type: 'city' },
  { name: 'Indore',     lat: 22.7196, lon: 75.8577, type: 'city' },
  { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, type: 'city' },
  { name: 'Kochi',      lat: 9.9312,  lon: 76.2673, type: 'city' },
  { name: 'Vadodara',   lat: 22.3072, lon: 73.1812, type: 'city' },
  { name: 'Agra',       lat: 27.1767, lon: 78.0081, type: 'city' },
  { name: 'Varanasi',   lat: 25.3176, lon: 82.9739, type: 'city' },
  { name: 'Amritsar',   lat: 31.6340, lon: 74.8723, type: 'city' },
  { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, type: 'city' },
  { name: 'Guwahati',   lat: 26.1445, lon: 91.7362, type: 'city' },
  { name: 'Jodhpur',    lat: 26.2389, lon: 73.0243, type: 'city' },
  { name: 'Mysore',     lat: 12.2958, lon: 76.6394, type: 'city' },
  { name: 'Jabalpur',   lat: 23.1815, lon: 79.9864, type: 'city' },
  { name: 'Madurai',    lat: 9.9252,  lon: 78.1198, type: 'city' },
  // Minor & Tier-2/Tier-3 Cities
  { name: 'Salem', lat: 11.6643, lon: 78.1460, type: 'city' },
  { name: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047, type: 'city' },
  { name: 'Erode', lat: 11.3410, lon: 77.7172, type: 'city' },
  { name: 'Vellore', lat: 12.9165, lon: 79.1325, type: 'city' },
  { name: 'Rajkot', lat: 22.3039, lon: 70.8022, type: 'city' },
  { name: 'Bhavnagar', lat: 21.7645, lon: 72.1519, type: 'city' },
  { name: 'Jamnagar', lat: 22.4707, lon: 70.0577, type: 'city' },
  { name: 'Aurangabad', lat: 19.8762, lon: 75.3433, type: 'city' },
  { name: 'Solapur', lat: 17.6599, lon: 75.9064, type: 'city' },
  { name: 'Amravati', lat: 20.9320, lon: 77.7523, type: 'city' },
  { name: 'Nanded', lat: 19.1383, lon: 77.3210, type: 'city' },
  { name: 'Kolhapur', lat: 16.7050, lon: 74.2433, type: 'city' },
  { name: 'Gwalior', lat: 26.2183, lon: 78.1828, type: 'city' },
  { name: 'Ujjain', lat: 23.1765, lon: 75.9261, type: 'city' },
  { name: 'Ratlam', lat: 23.3315, lon: 75.0367, type: 'city' },
  { name: 'Mangalore', lat: 12.9141, lon: 74.8560, type: 'city' },
  { name: 'Hubli', lat: 15.3647, lon: 75.1240, type: 'city' },
  { name: 'Belagavi', lat: 15.8497, lon: 74.4977, type: 'city' },
  { name: 'Davanagere', lat: 14.4644, lon: 75.9218, type: 'city' },
  { name: 'Warangal', lat: 17.9689, lon: 79.5941, type: 'city' },
  { name: 'Nizamabad', lat: 18.6704, lon: 78.1000, type: 'city' },
  { name: 'Karimnagar', lat: 18.4386, lon: 79.1288, type: 'city' },
  { name: 'Guntur', lat: 16.3067, lon: 80.4365, type: 'city' },
  { name: 'Nellore', lat: 14.4426, lon: 79.9865, type: 'city' },
  { name: 'Kurnool', lat: 15.8281, lon: 78.0373, type: 'city' },
  { name: 'Jamshedpur', lat: 22.8046, lon: 86.2029, type: 'city' },
  { name: 'Dhanbad', lat: 23.7957, lon: 86.4304, type: 'city' },
  { name: 'Cuttack', lat: 20.4625, lon: 85.8828, type: 'city' },
  { name: 'Rourkela', lat: 22.2604, lon: 84.8536, type: 'city' },
  { name: 'Asansol', lat: 23.6889, lon: 86.9661, type: 'city' },
  { name: 'Siliguri', lat: 26.7271, lon: 88.3953, type: 'city' },
  { name: 'Durgapur', lat: 23.5204, lon: 87.3119, type: 'city' },
  { name: 'Kota', lat: 25.2138, lon: 75.8648, type: 'city' },
  { name: 'Bikaner', lat: 28.0229, lon: 73.3119, type: 'city' },
  { name: 'Ajmer', lat: 26.4499, lon: 74.6399, type: 'city' },
  { name: 'Udaipur', lat: 24.5854, lon: 73.7125, type: 'city' },
  { name: 'Jalandhar', lat: 31.3260, lon: 75.5762, type: 'city' },
  { name: 'Ludhiana', lat: 30.9010, lon: 75.8573, type: 'city' },
  { name: 'Patiala', lat: 30.3398, lon: 76.3869, type: 'city' },
  { name: 'Bareilly', lat: 28.3670, lon: 79.4304, type: 'city' },
  { name: 'Aligarh', lat: 27.8974, lon: 78.0880, type: 'city' },
  { name: 'Moradabad', lat: 28.8386, lon: 78.7733, type: 'city' },
  { name: 'Meerut', lat: 28.9845, lon: 77.7064, type: 'city' },
  { name: 'Gorakhpur', lat: 26.7606, lon: 83.3732, type: 'city' },
  { name: 'Tirupati', lat: 13.6288, lon: 79.4192, type: 'city' }
];

const WORLD_CITIES = [
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'UAE' },
  { name: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'China' },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173, country: 'Russia' },
  { name: 'Cairo', lat: 30.0444, lon: 31.2357, country: 'Egypt' },
  { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, country: 'Brazil' },
  { name: 'Cape Town', lat: -33.9249, lon: 18.4241, country: 'South Africa' },
  { name: 'Toronto', lat: 43.6510, lon: -79.3470, country: 'Canada' },
  { name: 'Mexico City', lat: 19.4326, lon: -99.1332, country: 'Mexico' },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, country: 'India' },
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, country: 'Argentina' },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'Germany' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
  { name: 'Seoul', lat: 37.5665, lon: 126.9780, country: 'South Korea' }
];

const VIEW_MODES = [
  { key: 'world', label: '🌍 World', center: [20, 0], zoom: 2 },
  { key: 'india', label: '🇮🇳 India', center: [22, 82], zoom: 5 },
];

const TILE_LAYERS = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
};

const MapsPage = () => {
  const { isDarkMode } = useTheme();
  const [view, setView] = useState('india');
  const [mapKey, setMapKey] = useState(0); // force remount on view change

  const currentView = VIEW_MODES.find(v => v.key === view);
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const cardBg    = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const cardBorder = isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)';
  const btnActive  = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
  const btnInactive = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const changeView = (key) => {
    setView(key);
    setMapKey(k => k + 1); // force map to reinitialize
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', color: textColor, fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem 1rem', flexShrink: 0 }}>
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 300, fontFamily: "'Playfair Display', serif", marginBottom: '0.25rem' }}>
            Weather Maps
          </h1>
          <p style={{ opacity: 0.55, fontSize: '0.9rem', marginBottom: '1rem' }}>
            Interactive map — explore Indian states &amp; world locations
          </p>

          {/* View Switch */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {VIEW_MODES.map(vm => (
              <button
                key={vm.key}
                onClick={() => changeView(vm.key)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(125,125,125,0.2)',
                  background: view === vm.key ? btnActive : btnInactive,
                  color: textColor,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: view === vm.key ? 500 : 400,
                  transition: 'all 0.2s',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {vm.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', borderRadius: '0', overflow: 'hidden', margin: '0 1.5rem 1.5rem' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '1.25rem', overflow: 'hidden',
          border: cardBorder, boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
        }}>
          <MapContainer
            key={mapKey}
            center={currentView.center}
            zoom={currentView.zoom}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              url={isDarkMode ? TILE_LAYERS.dark : TILE_LAYERS.light}
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            />

            {/* India markers only in India view */}
            {view === 'india' && INDIA_STATE_CAPITALS.map((loc, i) => {
              const icon = loc.type === 'ut' ? UTIcon : loc.type === 'city' ? cityIcon : capitalIcon;
              return (
                <Marker key={i} position={[loc.lat, loc.lon]} icon={icon}>
                  <Popup>
                    <div style={{ fontFamily: "'Outfit', sans-serif", minWidth: '160px' }}>
                      <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                        {loc.capital || loc.name}
                      </div>
                      {loc.name && loc.capital && (
                        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                          {loc.name}
                        </div>
                      )}
                      <div style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        background: loc.type === 'ut' ? '#ede9fe' : loc.type === 'city' ? '#dbeafe' : '#fef3c7',
                        color: loc.type === 'ut' ? '#7c3aed' : loc.type === 'city' ? '#1d4ed8' : '#b45309',
                      }}>
                        {loc.type === 'capital' ? '🏛 State Capital' : loc.type === 'ut' ? '🔶 Union Territory' : '🏙 Major City'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* World markers only in World view */}
            {view === 'world' && WORLD_CITIES.map((loc, i) => (
              <Marker key={`world-${i}`} position={[loc.lat, loc.lon]} icon={cityIcon}>
                <Popup>
                  <div style={{ fontFamily: "'Outfit', sans-serif", minWidth: '140px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.15rem' }}>
                      {loc.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.4rem' }}>
                      {loc.country}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend (India view only) */}
      {view === 'india' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '0 1.5rem 1.5rem',
            padding: '0.875rem 1.25rem',
            background: cardBg,
            border: cardBorder,
            borderRadius: '0.875rem',
            display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center',
            fontSize: '0.8rem', flexShrink: 0,
          }}
        >
          <span style={{ opacity: 0.6, fontWeight: 500 }}>Legend:</span>
          {[
            { color: '#f59e0b', label: '28 State Capitals' },
            { color: '#a78bfa', label: '8 Union Territories' },
            { color: '#3b82f6', label: 'Major Cities' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: l.color, border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              <span style={{ opacity: 0.85 }}>{l.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MapsPage;
