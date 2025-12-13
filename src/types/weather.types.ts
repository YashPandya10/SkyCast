export interface WeatherData {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  windSpeed: number;
  cityName: string;
  country: string;
  timestamp: number;
  timezoneOffset?: number; // seconds offset from UTC
}

export interface ForecastDay {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
}

export interface ForecastData {
  cityName: string;
  forecast: ForecastDay[];
  timestamp: number;
  timezoneOffset?: number;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface StoredCity {
  name: string;
  country: string;
  primary?: boolean;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}