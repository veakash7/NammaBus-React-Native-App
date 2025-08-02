import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useColorScheme } from 'react-native';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MapScreen from './src/screens/MapScreen';
import { themes } from './src/theme';

export default function App() {
  const [userFlow, setUserFlow] = useState('welcome');
  
  // Automatically detect if the user's device is in light or dark mode
  const colorScheme = useColorScheme();
  
  // Select the correct theme object based on the color scheme
  const activeTheme = themes[colorScheme] || themes.light;

  const renderScreen = () => {
    switch (userFlow) {
      case 'rider':
        return <MapScreen mode="rider" onExit={() => setUserFlow('welcome')} theme={activeTheme} />;
      case 'waiter':
        return <MapScreen mode="waiter" onExit={() => setUserFlow('welcome')} theme={activeTheme} />;
      default:
        // Pass the active theme to the WelcomeScreen
        return <WelcomeScreen onSelectFlow={setUserFlow} theme={activeTheme} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <StatusBar style={activeTheme.mode === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});