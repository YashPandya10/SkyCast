import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import ForecastScreen from '../screens/ForecastScreen';
import CitiesScreen from '../screens/CitiesScreen';
import { COLORS } from '../utils/theme';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (route: any, focused: boolean, color: string, size: number) => {
  let iconName: string;

  if (route.name === 'Home') {
    iconName = focused ? 'weather-partly-cloudy' : 'weather-cloudy';
  } else if (route.name === 'Forecast') {
    iconName = focused ? 'calendar-week' : 'calendar-blank';
  } else {
    iconName = focused ? 'city' : 'city-variant-outline';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route, focused, color, size),
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#b3d9ff',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.primary,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 0,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Current' }}
        />
        <Tab.Screen
          name="Forecast"
          component={ForecastScreen}
          options={{ title: '7-Day' }}
        />
        <Tab.Screen
          name="Cities"
          component={CitiesScreen}
          options={{ title: 'Cities' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;