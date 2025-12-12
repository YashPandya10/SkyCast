module.exports = {
  preset: 'react-native',
  // Transform modern ESM packages from node_modules that Jest can't parse by default
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-navigation|@react-native-community|@react-native-async-storage|react-native-vector-icons|react-native-geolocation-service)/)',
  ],
  setupFiles: ['<rootDir>/jest-setup.js'],
};
