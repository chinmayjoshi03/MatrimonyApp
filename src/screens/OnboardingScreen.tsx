import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Navigation prop type for OnboardingScreen
type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

// Component for the onboarding screen to introduce the app and navigate to login
const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* App logo */}
      <Image
        source={require('../../assets/matrimony-logo.jpg')} // TODO: Verify asset path
        style={styles.logo}
      />
      {/* Title and subtitle */}
      <Text style={styles.title}>Find Your Perfect Match</Text>
      <Text style={styles.subtitle}>Join thousands of people finding their life partners</Text>
      {/* Navigation button to login */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.startButtonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles for the OnboardingScreen component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default OnboardingScreen;