import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BrowseScreen from './src/screens/BrowseScreen';
import LikesScreen from './src/screens/LikesScreen';
import CreateProfileScreen from './src/screens/CreateProfileScreen';
import { RootStackParamList } from './src/types';
import MessagesScreen from './src/screens/MessageScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
        
        <Stack.Navigator initialRouteName="Onboarding"
        screenOptions={{
            headerStyle: {
              backgroundColor: 'white',
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
            },
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
            },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen}/>
          <Stack.Screen name="Browse" component={BrowseScreen} />
          <Stack.Screen name="Likes" component={LikesScreen} />
          <Stack.Screen name="Messages" component={MessagesScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});