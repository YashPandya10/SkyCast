// src/components/ForecastItem.tsx

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { ForecastDay } from '../types/weather.types';
import { WEATHER_ICON_URL } from '../utils/constants';
import { COLORS } from '../utils/theme';

interface ForecastItemProps {
  forecast: ForecastDay;
  tempUnit: string;
}

const ForecastItem: React.FC<ForecastItemProps> = ({ forecast, tempUnit }) => {
  const convertTemp = (temp: number): number => {
    return tempUnit === 'F' ? Math.round((temp * 9) / 5 + 32) : temp;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const iconUrl = `${WEATHER_ICON_URL}/${forecast.icon}@2x.png`;

  return (
    <Card style={[styles.card, { backgroundColor: COLORS.surface }]} elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.dateSection}>
          <Text style={styles.date}>
            {formatDate(forecast.date)}
          </Text>
        </View>

        <View style={styles.iconBackground}>
          <Image source={{ uri: iconUrl }} style={styles.icon} />
        </View>

        <View style={styles.tempSection}>
          <Text style={styles.description}>
            {forecast.description.charAt(0).toUpperCase() + forecast.description.slice(1)}
          </Text>
          <View style={styles.tempRow}>
            <Text style={styles.tempMax} accessibilityRole="text">
              {convertTemp(forecast.tempMax)}°
            </Text>
            <Text style={styles.tempMin} accessibilityRole="text">
              / {convertTemp(forecast.tempMin)}°
            </Text>
          </View>
          <Text style={styles.humidity} accessibilityRole="text">
            💧 {forecast.humidity}%
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dateSection: {
    flex: 1,
  },
  date: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  icon: {
    width: 60,
    height: 60,
    marginHorizontal: 8,
  },
  iconBackground: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(15,118,110,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(16,32,39,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tempSection: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  description: {
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontSize: 14,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tempMax: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tempMin: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  humidity: {
    color: COLORS.textSecondary,
    marginTop: 4,
    fontSize: 12,
  },
});

export default ForecastItem;
