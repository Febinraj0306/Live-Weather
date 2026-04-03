export const fetchWeather = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,weather_code,precipitation_probability,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return response.json();
};

export const searchLocation = async (query) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch location data');
  }
  const data = await response.json();
  return data.results || [];
};

export const getWeatherDescription = (code, isDay = 1) => {
  const weatherCodes = {
    0: { txt: 'Clear sky', icon: isDay ? 'sun' : 'moon' },
    1: { txt: 'Mainly clear', icon: isDay ? 'cloud-sun' : 'cloud-moon' },
    2: { txt: 'Partly cloudy', icon: 'cloud' },
    3: { txt: 'Overcast', icon: 'cloud' },
    45: { txt: 'Fog', icon: 'cloud-fog' },
    48: { txt: 'Depositing rime fog', icon: 'cloud-fog' },
    51: { txt: 'Light drizzle', icon: 'cloud-drizzle' },
    53: { txt: 'Moderate drizzle', icon: 'cloud-drizzle' },
    55: { txt: 'Dense drizzle', icon: 'cloud-drizzle' },
    56: { txt: 'Light freezing drizzle', icon: 'cloud-drizzle' },
    57: { txt: 'Dense freezing drizzle', icon: 'cloud-drizzle' },
    61: { txt: 'Slight rain', icon: 'cloud-rain' },
    63: { txt: 'Moderate rain', icon: 'cloud-rain' },
    65: { txt: 'Heavy rain', icon: 'cloud-lightning' },
    66: { txt: 'Light freezing rain', icon: 'cloud-snow' },
    67: { txt: 'Heavy freezing rain', icon: 'cloud-snow' },
    71: { txt: 'Slight snow fall', icon: 'snowflake' },
    73: { txt: 'Moderate snow fall', icon: 'snowflake' },
    75: { txt: 'Heavy snow fall', icon: 'snowflake' },
    77: { txt: 'Snow grains', icon: 'snowflake' },
    80: { txt: 'Slight rain showers', icon: 'cloud-rain' },
    81: { txt: 'Moderate rain showers', icon: 'cloud-rain' },
    82: { txt: 'Violent rain showers', icon: 'cloud-lightning' },
    85: { txt: 'Slight snow showers', icon: 'cloud-snow' },
    86: { txt: 'Heavy snow showers', icon: 'cloud-snow' },
    95: { txt: 'Thunderstorm', icon: 'cloud-lightning' },
    96: { txt: 'Thunderstorm with slight hail', icon: 'cloud-lightning' },
    99: { txt: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
  };

  return weatherCodes[code] || { txt: 'Unknown condition', icon: 'help-circle' };
};

export const generateStory = (weatherData, locationName) => {
  if (!weatherData || !weatherData.current) return '';

  const {
    temperature_2m: temp,
    is_day: isDay,
    weather_code: code,
    wind_speed_10m: wind
  } = weatherData.current;

  const condition = getWeatherDescription(code, isDay).txt.toLowerCase();

  let timeOfDay = isDay ? "day" : "night";
  // Rough estimate of time context based on current time from API if needed, 
  // but let's use a nice generic storytelling pattern

  let tempMood = "mild";
  if (temp < 0) tempMood = "freezing";
  else if (temp < 10) tempMood = "chilly";
  else if (temp > 25) tempMood = "warm";
  else if (temp > 30) tempMood = "hot";

  let windStory = "";
  if (wind > 20) windStory = " with strong winds sweeping through.";
  else if (wind > 10) windStory = " with a gentle breeze in the air.";
  else windStory = ". It's perfectly still outside.";

  const intros = isDay ?
    ["The morning unfolds in ", "It's a beautiful afternoon in ", "Today's sky over "] :
    ["The night has settled over ", "Evening shadows fall on ", "A peaceful night in "];

  const selectedIntro = intros[Math.floor(Math.random() * intros.length)];

  return `${selectedIntro} ${locationName}. Expect ${condition} conditions as the ${timeOfDay} continues. It feels rather ${tempMood} at ${Math.round(temp)}°C${windStory}`;
};
