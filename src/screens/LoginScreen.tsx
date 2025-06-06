import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [emailOrMobile, setEmailOrMobile] = useState('');

  const handleContinue = async () => {
    if (!emailOrMobile) {
      Alert.alert('Error', 'Please enter your email or mobile number');
      return;
    }
    
    try {
        const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.email === emailOrMobile || parsedData.mobile === emailOrMobile) {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          
          // Check if profile exists
          const userProfile = await AsyncStorage.getItem('userProfile');
          
          if (userProfile) {
            // If profile exists, navigate to Browse screen
            navigation.navigate('Browse');
          } else {
            // If profile doesn't exist, navigate to Create Profile screen
            navigation.navigate('CreateProfile');
          }
        } else {
          Alert.alert('Error', 'No account found with these details');
        }
      } else {
        Alert.alert('Error', 'No user found. Please register.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'An error occurred while saving your data. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Info', 'Google login would be implemented here');
  };

  // const handlePhoneLogin = () => {
  //   navigation.navigate('PhoneLogin'); // You might want to create this screen
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPAfibtKYitXWfm46DLT95Jnldbrw4dtzmYSN6nRpar3Zo-kUNwKUm-qOgPP8GbIZ5hv6YYzhpjp6CaerApBmfmCmz6Pwga50SjJJEnjBz6kn7p5d2kwPZYR0Hp9rpapyyGeAJwMmDOfMEklrx_abEdudI5m7neP2RVLYWzYtwB6UtYInXX9u-4DVrjCQ0T2XoPOUn-KJraZqjWaBuaSXAQ5PvsuKJIS2jS6U5_jJ3Vc4tErYhZEkySUaKkE3nT2wA9DzNX-5HuSFN' }} 
          style={styles.logo}
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Let's get started</Text>
        <Text style={styles.subtitle}>Enter your details to sign up or log in.</Text>
      </View>

      <View style={styles.inputContainer}>
        <Icon name="person" size={24} color="#8B5B5D" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email or Mobile"
          placeholderTextColor="#A8898B"
          value={emailOrMobile}
          onChangeText={setEmailOrMobile}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividierText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgPpKcsOzJOsKZ-8DWGgn36Rx4OYlYTEJnDqErEnWc-swIGD6KfyBSYceoeNBUWzl__fwSdk0kwRom-sT0U_9VdksZmWWDIpVVpIEAKwoqiEwr7v-wiTgPOdYvtJ5zEa-uXglfjmd84M33dcKMIFDkBd_TNE6mWR6IXjBkxYxhCP2-e-XyyJ52gG_cGr4buneNbCofCsvekSL21Rq3FAfwF88m-wiyAp2ySHt4LgSGADv08OBg_jCkBqiXs1F8wbuw0YvLTF_jdWnw' }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Info', 'Phone login would be implemented here')}>
          <Icon name="call" size={24} color="#191011" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Phone</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signupContainer}>
  <Text style={styles.signupText}>Don't have an account?</Text>
  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
    <Text style={styles.signupButton}>Sign up</Text>
  </TouchableOpacity>
</View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink} onPress={() => Alert.alert('Terms', 'Terms of Service would be shown here')}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text style={styles.footerLink} onPress={() => Alert.alert('Privacy', 'Privacy Policy would be shown here')}>
            Privacy Policy
          </Text>.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBFC',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#191011',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B5B5D',
  },
  inputContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1E9EA',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#191011',
  },
  continueButton: {
    backgroundColor: '#E8B4B7',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E8B4B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1E9EA',
  },
  dividierText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#8B5B5D',
  },
  socialButtonsContainer: {
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0D2D3',
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
    fontWeight: '500',
    color: '#191011',
  },
  footer: {
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#A8898B',
    textAlign: 'center',
  },
  footerLink: {
    color: '#E8B4B7',
    fontWeight: '500',
  },
  signupContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 8,
  marginBottom: 16,
},
signupText: {
  fontSize: 14,
  color: '#8B5B5D',
},
signupButton: {
  fontSize: 14,
  fontWeight: '600',
  color: '#E8B4B7',
  marginLeft: 4,
},
});

export default LoginScreen;