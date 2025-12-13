// Replace with your OpenWeatherMap API key
export const WEATHER_API_KEY = '5d3704da50ef9cb3c8845925a7c55f1a';
export const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
export const WEATHER_ICON_URL = 'https://openweathermap.org/img/wn';

// Cache duration in milliseconds (30 minutes)
export const CACHE_DURATION = 30 * 60 * 1000;

// Storage keys
export const STORAGE_KEYS = {
  SAVED_CITIES: 'saved_cities',
  LAST_CITY: 'last_city',
  TEMP_UNIT: 'temp_unit',
  WEATHER_PREFIX: 'weather_',
  FORECAST_PREFIX: 'forecast_',
};

// Temperature units
export const TEMP_UNITS = {
  CELSIUS: 'C',
  FAHRENHEIT: 'F',
};