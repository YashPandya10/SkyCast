import axios from 'axios';
import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from '../utils/constants';
import { WeatherData, ForecastData, ForecastDay, City, LocationCoords } from '../types/weather.types';
import storageService from './storageService';

class WeatherService {
  private buildUrl(endpoint: string, params: Record<string, string | number>): string {
    const queryParams = new URLSearchParams({
      ...params,
      appid: WEATHER_API_KEY,
      units: 'metric',
    } as any).toString();

    return `${WEATHER_API_BASE_URL}/${endpoint}?${queryParams}`;
  }

  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    const cached = await storageService.getCachedWeather(cityName);
    // Prefer cached only if it includes timezoneOffset (ensures correct local time)
    if (cached && typeof cached.timezoneOffset !== 'undefined') {
      return cached;
    }

    const url = this.buildUrl('weather', { q: cityName });
    const response = await axios.get(url);
    const data = response.data;

    const weather: WeatherData = {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      cityName: data.name,
      country: data.sys.country,
      timestamp: Date.now(),
      timezoneOffset: data.timezone,
    };

    await storageService.cacheWeather(weather);
    return weather;
  }

  async getWeatherByCoords(coords: LocationCoords): Promise<WeatherData> {
    const url = this.buildUrl('weather', {
      lat: coords.latitude,
      lon: coords.longitude,
    });

    const response = await axios.get(url);
    const data = response.data;

    const weather: WeatherData = {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      cityName: data.name,
      country: data.sys.country,
      timestamp: Date.now(),
      timezoneOffset: data.timezone,
    };

    await storageService.cacheWeather(weather);
    return weather;
  }

  async getForecast(cityName: string): Promise<ForecastData> {
    const cached = await storageService.getCachedForecast(cityName);
    if (cached) {
      return cached;
    }

    const url = this.buildUrl('forecast', { q: cityName });
    const response = await axios.get(url);
    const data = response.data;

    const forecastMap = new Map<string, ForecastDay>();

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-CA');

      if (!forecastMap.has(date)) {
        forecastMap.set(date, {
          date,
          temp: Math.round(item.main.temp),
          tempMin: Math.round(item.main.temp_min),
          tempMax: Math.round(item.main.temp_max),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
        });
      } else {
        const existing = forecastMap.get(date)!;
        existing.tempMin = Math.min(existing.tempMin, Math.round(item.main.temp_min));
        existing.tempMax = Math.max(existing.tempMax, Math.round(item.main.temp_max));
      }
    });

    const forecast: ForecastData = {
      cityName: data.city.name,
      forecast: Array.from(forecastMap.values()).slice(0, 7),
      timestamp: Date.now(),
      timezoneOffset: data.city.timezone,
    };

    await storageService.cacheForecast(forecast);
    return forecast;
  }

  async searchCities(query: string): Promise<City[]> {
    if (query.length < 2) {
      return [];
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${WEATHER_API_KEY}`;
    const response = await axios.get(url);

    return response.data.map((item: any) => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  }
}

export default new WeatherService();