import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const GoLiveControls = ({ isLive, onToggle, routeNumber, setRouteNumber, theme }) => {
  const styles = StyleSheet.create({
    controlsContainer: { position: 'absolute', bottom: 30, left: 15, right: 15, backgroundColor: theme.surface, borderRadius: 20, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, opacity: 0.95 },
    routeInput: { height: 45, backgroundColor: theme.background, color: theme.text, borderRadius: 10, paddingHorizontal: 15, textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    goLiveButton: { paddingVertical: 15, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    goLiveButtonText: { color: theme.white, fontSize: 18, fontWeight: 'bold' },
  });

  return (
    <Animatable.View animation="fadeInUp" duration={1000} style={styles.controlsContainer}>
      <TextInput
        style={styles.routeInput}
        placeholder="Enter your bus #"
        value={routeNumber}
        onChangeText={setRouteNumber}
        editable={!isLive}
        placeholderTextColor={theme.placeholder}
      />
      <TouchableOpacity onPress={onToggle} style={[styles.goLiveButton, isLive ? {backgroundColor: theme.danger} : {backgroundColor: theme.success}]}>
        <Text style={styles.goLiveButtonText}>{isLive ? 'STOP SHARING' : 'GO LIVE'}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default GoLiveControls;