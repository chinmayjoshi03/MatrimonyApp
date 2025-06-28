import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BrowseScreen from './src/screens/BrowseScreen';
import LikesScreen from './src/screens/LikesScreen';
import CreateProfileScreen from './src/screens/CreateProfileScreen';
import MessagesScreen from './src/screens/MessageScreen';
import ChatScreen from './src/screens/ChatScreen';
import { RootStackParamList } from './src/types';

// Initialize the root stack navigator with typed parameters
const RootStack = createStackNavigator<RootStackParamList>();

// Root component for the app, managing navigation across screens
export default function App() {
  return (
    <NavigationContainer>
      {/* Status bar configuration for consistent appearance */}
      <StatusBar style="auto" />

      {/* Root navigator with default header styling */}
      <RootStack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerStyle: {
            backgroundColor: "white",
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
            color: "#333",
          },
          headerTitleAlign: "center",
        }}
      >
        {/* Onboarding flow screens without headers for full-screen experience */}
        <RootStack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Main app screens with standard headers for navigation */}
        <RootStack.Screen name="Profile" component={ProfileScreen} />
        <RootStack.Screen name="CreateProfile" component={CreateProfileScreen} />
        <RootStack.Screen name="Browse" component={BrowseScreen} />
        <RootStack.Screen name="Likes" component={LikesScreen} />
        <RootStack.Screen name="Messages" component={MessagesScreen} />
        <RootStack.Screen name="Chat" component={ChatScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

// Styles for the root app component
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});