import { mapDarkStyle } from './mapStyle';

const lightTheme = {
  mode: 'light',
  primary: '#4a148c', // Deep Purple
  secondary: '#f50057', // Hot Pink/Red for accents
  background: '#f3e5f5', // Light Lavender
  text: '#333',
  white: '#fff',
  success: '#28a745',
  danger: '#dc3545',
  surface: '#fff', // Card backgrounds, etc.
  placeholder: '#888',
  mapStyle: null,
};

const darkTheme = {
  mode: 'dark',
  primary: '#bb86fc', // Light Purple
  secondary: '#03dac6', // Teal
  background: '#121212', // Dark background
  text: '#e1e1e1',
  white: '#fff',
  success: '#4caf50',
  danger: '#cf6679',
  surface: '#1e1e1e', // Card backgrounds, etc.
  placeholder: '#777',
  mapStyle: mapDarkStyle,
};

export const themes = { light: lightTheme, dark: darkTheme };