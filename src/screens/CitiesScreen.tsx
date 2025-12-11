
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Portal, Modal, Searchbar, List, Button, Snackbar } from 'react-native-paper';
import CityListItem from '../components/CityListItem';
import weatherService from '../services/weatherService';
import storageService from '../services/storageService';
import { StoredCity, City } from '../types/weather.types';

const CitiesScreen: React.FC = () => {
  const [cities, setCities] = useState<StoredCity[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [searching, setSearching] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const loadCities = async () => {
    const savedCities = await storageService.getSavedCities();
    setCities(savedCities);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const results = await weatherService.searchCities(query);
    setSearchResults(results);
    setSearching(false);
  };

  const handleAddCity = async (city: City) => {
    const newCity: StoredCity = {
      name: city.name,
      country: city.country,
    };

    const added = await storageService.addCity(newCity);

    if (added) {
      await loadCities();
      setModalVisible(false);
      setSearchQuery('');
      setSearchResults([]);
      setSnackbarMessage(`${city.name} added successfully`);
      setSnackbarVisible(true);
    } else {
      setSnackbarMessage(`${city.name} is already in your list`);
      setSnackbarVisible(true);
    }
  };

  const handleDeleteCity = async (cityName: string) => {
    await storageService.removeCity(cityName);
    await loadCities();
    setSnackbarMessage(`${cityName} removed`);
    setSnackbarVisible(true);
  };

  const handleCityPress = async (cityName: string) => {
    await storageService.setLastCity(cityName);
    setSnackbarMessage(`Switched to ${cityName}`);
    setSnackbarVisible(true);
  };

  useEffect(() => {
    loadCities();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Cities</Text>
        <Text style={styles.headerSubtitle}>
          Tap a city to view its weather
        </Text>
      </View>

      {cities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No cities saved yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button below to add a city
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={cities}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <CityListItem
              city={item}
              onPress={() => handleCityPress(item.name)}
              onDelete={() => handleDeleteCity(item.name)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        color="#ffffff"
        onPress={() => setModalVisible(true)}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setSearchQuery('');
            setSearchResults([]);
          }}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Add City</Text>

          <Searchbar
            placeholder="Search for a city..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbar}
            loading={searching}
          />

          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  description={item.country}
                  onPress={() => handleAddCity(item)}
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                  style={styles.resultItem}
                />
              )}
              style={styles.resultsList}
            />
          ) : searchQuery.length >= 2 && !searching ? (
            <Text style={styles.noResults}>No cities found</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={() => {
              setModalVisible(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
            style={styles.cancelButton}
            buttonColor="#e0e0e0"
            textColor="#333"
          >
            Cancel
          </Button>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
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
  headerSubtitle: {
    color: '#ffffff',
    marginTop: 4,
    fontSize: 14,
    opacity: 0.9,
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0077b6',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    fontSize: 22,
    color: '#0077b6',
  },
  searchbar: {
    marginBottom: 16,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  noResults: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  cancelButton: {
    marginTop: 16,
  },
  snackbar: {
    backgroundColor: '#0077b6',
  },
});

export default CitiesScreen;