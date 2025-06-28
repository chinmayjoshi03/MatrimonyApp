import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList, UserProfile } from '../types';

// Navigation prop type for MessagesScreen
type MessagesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Messages'>;

// Interface for conversation data
interface Conversation {
  id: string;
  user: UserProfile;
  lastMessage: string;
  timestamp: string;
}

// Component for displaying a list of conversations with liked profiles
const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Load conversations from liked profiles (mock implementation)
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const savedLikedProfiles = await AsyncStorage.getItem('likedProfiles');
        if (savedLikedProfiles) {
          const likedProfiles: UserProfile[] = JSON.parse(savedLikedProfiles);
          // TODO: Replace mock conversations with real data from backend
          const mockConversations: Conversation[] = likedProfiles.map((profile, index) => ({
            id: profile.id,
            user: profile,
            lastMessage: `Hi! I'm interested in connecting!`,
            timestamp: new Date(Date.now() - index * 3600000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setConversations(mockConversations);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        // TODO: Show user-friendly error message
      }
    };
    loadConversations();
  }, []);

  // Render a single conversation card
  const renderConversation = useCallback(
    ({ item }: { item: Conversation }) => (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => navigation.navigate('Chat', { userId: item.user.id })}
      >
        <Image source={{ uri: item.user.photo }} style={styles.avatar} />
        <View style={styles.conversationInfo}>
          <Text style={styles.conversationName}>{item.user.name}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </TouchableOpacity>
    ),
    [navigation]
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Conversation list or empty state */}
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
        />
      ) : (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>No messages yet</Text>
          <Text style={styles.noMessagesSubText}>Start swiping to match and chat!</Text>
        </View>
      )}

      {/* Footer with navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Browse')}
        >
          <Icon name="explore" size={24} color="#666" />
          <Text style={styles.footerText}>Browse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Likes')}
        >
          <Icon name="favorite" size={24} color="#666" />
          <Text style={styles.footerText}>Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Messages')}
        >
          <Icon name="message" size={24} color="#666" />
          <Text style={styles.footerText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person" size={24} color="#666" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles for the MessagesScreen component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messageList: {
    flex: 1,
    padding: 20,
  },
  conversationCard: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    alignSelf: "flex-start",
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMessagesText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  noMessagesSubText: {
    fontSize: 14,
    color: "#999",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
});

export default MessagesScreen;