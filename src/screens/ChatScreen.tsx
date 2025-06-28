import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Route prop type for ChatScreen
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

// Props interface for ChatScreen
interface ChatScreenProps {
  route: ChatScreenRouteProp;
}

// Placeholder component for displaying a chat interface with a user
const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { userId } = route.params;

  // Validate userId to prevent undefined behavior
  if (!userId) {
    return (
      <View style={styles.screenContainer}>
        <Text style={styles.errorMessage}>No user selected for chat</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Chat with User {userId}</Text>
      {/* TODO: Replace with actual chat implementation */}
      <Text style={styles.message}>This is a placeholder for the chat screen.</Text>
    </View>
  );
};

// Styles for the ChatScreen component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
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
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
  },
});

export default ChatScreen;