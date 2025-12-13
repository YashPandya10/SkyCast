
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, CACHE_DURATION } from '../utils/constants';
import { StoredCity, WeatherData, ForecastData } from '../types/weather.types';

class StorageService {
  async getSavedCities(): Promise<StoredCity[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_CITIES);
    return data ? JSON.parse(data) : [];
  }

  async saveCities(cities: StoredCity[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CITIES, JSON.stringify(cities));
  }

  async addCity(city: StoredCity): Promise<boolean> {
    const cities = await this.getSavedCities();
    const exists = cities.some(c => c.name === city.name);

    if (exists) {
      return false;
    }

    cities.push(city);
    await this.saveCities(cities);
    return true;
  }

  async removeCity(cityName: string): Promise<void> {
    const cities = await this.getSavedCities();
    const filtered = cities.filter(c => c.name !== cityName);
    await this.saveCities(filtered);

    // Clean up cached data
    await AsyncStorage.removeItem(`${STORAGE_KEYS.WEATHER_PREFIX}${cityName}`);
    await AsyncStorage.removeItem(`${STORAGE_KEYS.FORECAST_PREFIX}${cityName}`);
  }

  async getLastCity(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_CITY);
  }

  async setLastCity(cityName: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_CITY, cityName);
  }

  async getTempUnit(): Promise<string> {
    const unit = await AsyncStorage.getItem(STORAGE_KEYS.TEMP_UNIT);
    return unit || 'C';
  }

  async setTempUnit(unit: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TEMP_UNIT, unit);
  }

  async getCachedWeather(cityName: string): Promise<WeatherData | null> {
    const key = `${STORAGE_KEYS.WEATHER_PREFIX}${cityName}`;
    const data = await AsyncStorage.getItem(key);

    if (!data) {
      return null;
    }

    const weather: WeatherData = JSON.parse(data);
    const now = Date.now();

    if (now - weather.timestamp > CACHE_DURATION) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return weather;
  }

  async cacheWeather(weather: WeatherData): Promise<void> {
    const key = `${STORAGE_KEYS.WEATHER_PREFIX}${weather.cityName}`;
    await AsyncStorage.setItem(key, JSON.stringify(weather));
  }

  async getCachedForecast(cityName: string): Promise<ForecastData | null> {
    const key = `${STORAGE_KEYS.FORECAST_PREFIX}${cityName}`;
    const data = await AsyncStorage.getItem(key);

    if (!data) {
      return null;
    }

    const forecast: ForecastData = JSON.parse(data);
    const now = Date.now();

    if (now - forecast.timestamp > CACHE_DURATION) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return forecast;
  }

  async cacheForecast(forecast: ForecastData): Promise<void> {
    const key = `${STORAGE_KEYS.FORECAST_PREFIX}${forecast.cityName}`;
    await AsyncStorage.setItem(key, JSON.stringify(forecast));
  }
}

export default new StorageService();