import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types';

// Navigation prop type for RegisterScreen
type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

// Component for user registration with email and password
const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle registration with input validation
  const handleRegister = async () => {
    // Validate inputs
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Check for existing user
      const existingUserData = await AsyncStorage.getItem('userData');
      if (existingUserData) {
        const parsedData = JSON.parse(existingUserData);
        if (parsedData.email === email) {
          Alert.alert('Error', 'An account with this email already exists.');
          return;
        }
      }

      // Save user data and set login status
      await AsyncStorage.setItem('userData', JSON.stringify({ email, password }));
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // Check if profile exists
      const userProfile = await AsyncStorage.getItem('userProfile');
      navigation.navigate(userProfile ? 'Browse' : 'CreateProfile');
    } catch (error) {
      console.error('Failed to register:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
  };

  return (
    <View style={styles.screenContainer}>
      {/* Title */}
      <Text style={styles.title}>Register</Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Confirm password input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#666"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Register button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Login link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLinkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the RegisterScreen component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    backgroundColor: "white",
  },
  registerButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLinkText: {
    color: "#FF6B6B",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default RegisterScreen;