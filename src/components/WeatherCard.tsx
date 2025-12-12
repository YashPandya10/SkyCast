// src/components/WeatherCard.tsx

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { WeatherData } from '../types/weather.types';
import { WEATHER_ICON_URL } from '../utils/constants';
import { COLORS } from '../utils/theme';

interface WeatherCardProps {
  weather: WeatherData;
  tempUnit: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, tempUnit }) => {
  const convertTemp = (temp: number): number => {
    return tempUnit === 'F' ? Math.round((temp * 9) / 5 + 32) : temp;
  };

  const iconUrl = `${WEATHER_ICON_URL}/${weather.icon}@2x.png`;

  const tempForColor = tempUnit === 'F' ? Math.round((weather.temp * 9) / 5 + 32) : weather.temp;
  const tempColor = tempForColor >= 30 ? '#d84315' : tempForColor <= 0 ? '#1565c0' : '#333';

  // Correct city-local time calculation:
  // OpenWeather `timezone` is seconds offset from UTC for the city.
  // City local time (as an absolute instant) = current UTC time + city offset.
  const cityMs = Date.now() + ((weather.timezoneOffset ?? 0) * 1000);
  const cityDate = new Date(cityMs);
  const hours24 = cityDate.getUTCHours();
  const minutes = cityDate.getUTCMinutes();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const localTime = `${hours12}:${pad(minutes)} ${period}`;

  return (
    <Card style={[styles.card, { backgroundColor: COLORS.surface }]} elevation={4}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.cityName}>
            {weather.cityName}, {weather.country}
          </Text>
          <Text style={styles.localTime}>{localTime}</Text>
        </View>

        <View style={styles.mainInfo}>
          <View style={styles.iconBackground}>
            <Image source={{ uri: iconUrl }} style={styles.icon} />
          </View>
          <Text style={[styles.temperature, { color: tempColor }]}>
            {convertTemp(weather.temp)}°{tempUnit}
          </Text>
        </View>

        <Text style={styles.condition} accessibilityRole="text">
          {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text variant="bodySmall" style={styles.detailLabel}>Feels Like</Text>
            <Text style={styles.detailValue}>{convertTemp(weather.feelsLike)}°{tempUnit}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text variant="bodySmall" style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{weather.humidity}%</Text>
          </View>

          <View style={styles.detailItem}>
            <Text variant="bodySmall" style={styles.detailLabel}>Wind Speed</Text>
            <Text style={styles.detailValue}>{weather.windSpeed} m/s</Text>
          </View>
        </View>

        <View style={styles.minMax}>
          <Text variant="bodyLarge" style={styles.minMaxText}>
            H: {convertTemp(weather.tempMax)}° L: {convertTemp(weather.tempMin)}°
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    maxWidth: 400,
    alignSelf: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary,
  },
  localTime: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 4,
    fontSize: 14,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 100,
    height: 100,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(15,118,110,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16,32,39,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  temperature: {
    fontSize: 56,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  condition: {
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.textSecondary,
    fontSize: 18,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    color: COLORS.muted,
    marginBottom: 4,
    fontSize: 12,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  minMax: {
    alignItems: 'center',
  },
  minMaxText: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});

export default WeatherCard;