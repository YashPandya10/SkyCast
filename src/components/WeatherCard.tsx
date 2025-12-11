// src/components/WeatherCard.tsx

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { WeatherData } from '../types/weather.types';
import { WEATHER_ICON_URL } from '../utils/constants';

interface WeatherCardProps {
  weather: WeatherData;
  tempUnit: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, tempUnit }) => {
  const convertTemp = (temp: number): number => {
    return tempUnit === 'F' ? Math.round((temp * 9) / 5 + 32) : temp;
  };

  const iconUrl = `${WEATHER_ICON_URL}/${weather.icon}@2x.png`;

  return (
    <Card style={styles.card} elevation={4}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.cityName}>
            {weather.cityName}, {weather.country}
          </Text>
        </View>

        <View style={styles.mainInfo}>
          <Image source={{ uri: iconUrl }} style={styles.icon} />
          <Text style={styles.temperature}>
            {convertTemp(weather.temp)}°{tempUnit}
          </Text>
        </View>

        <Text style={styles.condition}>
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
    backgroundColor: '#ffffff',
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
    color: '#0077b6',
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
  temperature: {
    fontSize: 56,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  condition: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
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
    color: '#666',
    marginBottom: 4,
    fontSize: 12,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  minMax: {
    alignItems: 'center',
  },
  minMaxText: {
    color: '#333',
    fontWeight: '500',
  },
});

export default WeatherCard;