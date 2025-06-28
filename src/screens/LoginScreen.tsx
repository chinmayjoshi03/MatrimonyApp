import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';

// Navigation prop type for LoginScreen
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// Component for user login via email or mobile with social login options
const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [emailOrMobile, setEmailOrMobile] = useState('');

  // Validate and handle login continuation
  const handleContinue = async () => {
    if (!emailOrMobile) {
      Alert.alert('Error', 'Please enter your email or mobile number');
      return;
    }

    // Basic email/mobile validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    if (!emailRegex.test(emailOrMobile) && !mobileRegex.test(emailOrMobile)) {
      Alert.alert('Error', 'Please enter a valid email or 10-digit mobile number');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'No user found. Please register.');
        return;
      }

      const parsedData = JSON.parse(userData);
      if (
        !parsedData.email ||
        !parsedData.mobile ||
        (parsedData.email !== emailOrMobile && parsedData.mobile !== emailOrMobile)
      ) {
        Alert.alert('Error', 'No account found with these details');
        return;
      }

      await AsyncStorage.setItem('isLoggedIn', 'true');
      const userProfile = await AsyncStorage.getItem('userProfile');
      navigation.navigate(userProfile ? 'Browse' : 'CreateProfile');
    } catch (error) {
      console.error('Failed to process login:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    }
  };

  // Placeholder for Google login implementation
  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    Alert.alert('Info', 'Google login would be implemented here');
  };

  return (
    <View style={styles.screenContainer}>
      {/* App logo */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://example.com/logo.png' }} // TODO: Replace with local asset or constant
          style={styles.logo}
        />
      </View>

      {/* Title and subtitle */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Let's Get Started</Text>
        <Text style={styles.subtitle}>Enter your details to sign up or log in.</Text>
      </View>

      {/* Email or mobile input */}
      <View style={styles.inputWrapper}>
        <Icon name="person" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email or Mobile"
          placeholderTextColor="#666"
          value={emailOrMobile}
          onChangeText={setEmailOrMobile}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Continue button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerWrapper}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social login buttons */}
      <View style={styles.socialButtonsWrapper}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <Image
            source={{ uri: 'https://example.com/google-logo.png' }} // TODO: Replace with local asset or constant
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => Alert.alert('Info', 'Phone login would be implemented here')}
        >
          <Icon name="call" size={24} color="#333" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Phone</Text>
        </TouchableOpacity>
      </View>

      {/* Register link */}
      <View style={styles.registerLinkWrapper}>
        <Text style={styles.registerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButton}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Footer with terms and privacy links */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text
            style={styles.footerLink}
            onPress={() => Alert.alert('Terms', 'Terms of Service would be shown here')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.footerLink}
            onPress={() => Alert.alert('Privacy', 'Privacy Policy would be shown here')}
          >
            Privacy Policy
          </Text>.
        </Text>
      </View>
    </View>
  );
};

// Styles for the LoginScreen component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
  },
  titleWrapper: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  dividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#666",
  },
  socialButtonsWrapper: {
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    height: 56,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  registerLinkWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
    marginLeft: 4,
  },
  footer: {
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  footerLink: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
});

export default LoginScreen;