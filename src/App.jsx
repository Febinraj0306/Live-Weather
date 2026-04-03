import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import WeatherPage from './pages/WeatherPage';
import CitiesPage from './pages/CitiesPage';
import MapsPage from './pages/MapsPage';
import SettingsPage from './pages/SettingsPage';
import DetailsPage from './pages/DetailsPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<WeatherPage />} />
            <Route path="/cities" element={<CitiesPage />} />
            <Route path="/maps" element={<MapsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/details" element={<DetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
