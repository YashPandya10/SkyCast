// src/screens/HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, Text, Button, Snackbar, IconButton } from 'react-native-paper';
import WeatherCard from '../components/WeatherCard';
import weatherService from '../services/weatherService';
import locationService from '../services/locationService';
import storageService from '../services/storageService';
import { WeatherData } from '../types/weather.types';

const HomeScreen: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tempUnit, setTempUnit] = useState('C');
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const loadWeather = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');

    const lastCity = await storageService.getLastCity();

    if (lastCity) {
      const data = await weatherService.getWeatherByCity(lastCity);
      setWeather(data);
      if (showLoading) setLoading(false);
      return;
    }

    const location = await locationService.getCurrentLocation();

    if (location) {
      const data = await weatherService.getWeatherByCoords(location);
      setWeather(data);
      await storageService.setLastCity(data.cityName);
    } else {
      setError('Unable to get location. Please enable location services or add a city manually.');
    }

    if (showLoading) setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWeather(false);
    setRefreshing(false);
  };

  const toggleTempUnit = async () => {
    const newUnit = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(newUnit);
    await storageService.setTempUnit(newUnit);
    setSnackbarVisible(true);
  };

  useEffect(() => {
    const init = async () => {
      const unit = await storageService.getTempUnit();
      setTempUnit(unit);
      await loadWeather();
    };
    init();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0077b6" />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (error && !weather) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          mode="contained"
          onPress={() => loadWeather()}
          style={styles.retryButton}
          buttonColor="#0077b6"
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Current Weather</Text>
        <IconButton
          icon={tempUnit === 'C' ? 'temperature-celsius' : 'temperature-fahrenheit'}
          size={28}
          iconColor="#ffffff"
          onPress={toggleTempUnit}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {weather && <WeatherCard weather={weather} tempUnit={tempUnit} />}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        Temperature unit changed to °{tempUnit}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#0077b6',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
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
    color: '#0077b6',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#d32f2f',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
  },
  retryButton: {
    marginTop: 16,
  },
  snackbar: {
    backgroundColor: '#0077b6',
  },
});

export default HomeScreen;