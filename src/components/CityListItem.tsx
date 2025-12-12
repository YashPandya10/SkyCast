// src/components/CityListItem.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { COLORS } from '../utils/theme';
import { StoredCity } from '../types/weather.types';

interface CityListItemProps {
  city: StoredCity;
  onPress: () => void;
  onDelete: () => void;
  isPrimary?: boolean;
}

const CityListItem: React.FC<CityListItemProps> = ({ city, onPress, onDelete, isPrimary }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: COLORS.surface }]} activeOpacity={0.85}>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.cityName}>{city.name}</Text>
          {isPrimary && <Text style={styles.primaryBadge}>★</Text>}
          {isPrimary && <Text style={styles.primaryLabel}>Primary</Text>}
        </View>
        <Text style={styles.country}>{city.country}</Text>
      </View>
      <View style={styles.deleteWrapper}>
        <IconButton
          icon="trash-can"
          size={20}
          iconColor="#ffffff"
          style={styles.deleteButton}
          onPress={onDelete}
          accessibilityLabel={`Delete ${city.name}`}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBadge: {
    marginLeft: 8,
    color: '#ffd54f',
    fontSize: 16,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  country: {
    fontSize: 14,
    color: '#666',
  },
  deleteWrapper: {
    marginLeft: 12,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
  },
  primaryLabel: {
    marginLeft: 8,
    backgroundColor: COLORS.accent,
    color: COLORS.textPrimary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CityListItem;