
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { COLORS } from '../utils/theme';
import ForecastItem from '../components/ForecastItem';
import weatherService from '../services/weatherService';
import storageService from '../services/storageService';
import { ForecastData } from '../types/weather.types';
import { useFocusEffect } from '@react-navigation/native';

const ForecastScreen: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tempUnit, setTempUnit] = useState('C');
  const [error, setError] = useState('');

  const loadForecast = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');

    const lastCity = await storageService.getLastCity();

    if (!lastCity) {
      setError('No city selected. Please go to Home to select a location.');
      if (showLoading) setLoading(false);
      return;
    }

    const data = await weatherService.getForecast(lastCity);
    setForecast(data);
    if (showLoading) setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadForecast(false);
    setRefreshing(false);
  };

  useEffect(() => {
    const init = async () => {
      const unit = await storageService.getTempUnit();
      setTempUnit(unit);
      await loadForecast();
    };
    init();
  }, []);

  // reload forecast when screen is focused to reflect last selected city
  useFocusEffect(
    useCallback(() => {
      loadForecast();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0077b6" />
        <Text style={styles.loadingText}>Loading forecast...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>7-Day Forecast</Text>
        {forecast && (
          <Text style={styles.cityName}>{forecast.cityName}</Text>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {forecast?.forecast.map((day, index) => (
          <ForecastItem key={index} forecast={day} tempUnit={tempUnit} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cityName: {
    color: '#ffffff',
    marginTop: 4,
    fontSize: 16,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#87CEFA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primary,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#d32f2f',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
  },
});

export default ForecastScreen;