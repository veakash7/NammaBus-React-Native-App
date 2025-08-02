import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';

// The component now receives `theme` as a prop
const WelcomeScreen = ({ onSelectFlow, theme }) => {
  
  // Styles are now created inside the component to access the theme prop
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', marginBottom: 80 },
    title: { fontSize: 42, fontWeight: 'bold', color: theme.primary, textAlign: 'center' },
    subtitle: { fontSize: 18, color: theme.text, marginTop: 10 },
    optionsContainer: { width: '90%' },
    optionButton: { padding: 20, borderRadius: 20, marginBottom: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
    optionIcon: { fontSize: 40 },
    optionText: { fontSize: 24, fontWeight: 'bold', color: theme.white, marginTop: 10 },
    optionSubtext: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', marginTop: 5 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animatable.Text animation="fadeInDown" duration={1500} style={styles.title}>
          Commute Companion
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={500} duration={1500} style={styles.subtitle}>
          Real-time bus tracking for Bengaluru
        </Animatable.Text>
      </View>
      <View style={styles.optionsContainer}>
        <Animatable.View animation="fadeInLeft" delay={1000} duration={1000}>
          <TouchableOpacity style={[styles.optionButton, {backgroundColor: theme.success}]} onPress={() => onSelectFlow('rider')}>
            <Text style={styles.optionIcon}>🚌</Text>
            <Text style={styles.optionText}>I'm on a Bus</Text>
            <Text style={styles.optionSubtext}>Share location</Text>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View animation="fadeInRight" delay={1000} duration={1000}>
          <TouchableOpacity style={[styles.optionButton, {backgroundColor: theme.primary}]} onPress={() => onSelectFlow('waiter')}>
            <Text style={styles.optionIcon}>📍</Text>
            <Text style={styles.optionText}>Find My Bus</Text>
            <Text style={styles.optionSubtext}>View map</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;