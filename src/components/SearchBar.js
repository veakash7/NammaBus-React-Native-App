import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ searchQuery, setSearchQuery, theme }) => {
  const styles = StyleSheet.create({
    searchContainer: { position: 'absolute', top: 90, left: 15, right: 15, zIndex: 1 },
    searchInput: {
      height: 50,
      backgroundColor: theme.surface,
      color: theme.text,
      borderRadius: 10,
      paddingHorizontal: 15,
      fontSize: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
  });

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a bus route (e.g., 335-E)"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={theme.placeholder}
      />
    </View>
  );
};

export default SearchBar;