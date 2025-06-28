import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';
import Footer from '../components/Footer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Screen dimensions and swipe threshold
const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

type LikesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Likes'>;

// Props interface for LikesScreen
interface LikesScreenProps {
  navigation: LikesScreenNavigationProp;
}

// Component for displaying and managing liked profiles with swipe-to-remove functionality
const LikesScreen: React.FC<LikesScreenProps> = ({ navigation }) => {
  const [likedProfiles, setLikedProfiles] = useState<UserProfile[]>([]);

  // Load liked profiles from AsyncStorage
  useEffect(() => {
    const loadLikedProfiles = async () => {
      try {
        const savedLiked = await AsyncStorage.getItem('likedProfiles');
        if (savedLiked) {
          setLikedProfiles(JSON.parse(savedLiked));
        }
      } catch (error) {
        console.error('Failed to load liked profiles:', error);
        // TODO: Show user-friendly error message
      }
    };
    loadLikedProfiles();
  }, []);

  // Handle right swipe to remove a profile from liked list
  const handleSwipeRight = async (profileId: string) => {
    const updatedLikedProfiles = likedProfiles.filter((profile) => profile.id !== profileId);
    setLikedProfiles(updatedLikedProfiles);
    try {
      await AsyncStorage.setItem('likedProfiles', JSON.stringify(updatedLikedProfiles));
    } catch (error) {
      console.error('Failed to update liked profiles:', error);
      // TODO: Show user-friendly error message
    }
  };

  // Render a single profile card with swipe functionality
  const renderProfile = useCallback(
    ({ item }: { item: UserProfile }) => {
      const translateX = new Animated.Value(0);

      const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
      );

      const onHandlerStateChange = ({
        nativeEvent: { translationX, oldState },
      }: {
        nativeEvent: { translationX: number; oldState: number };
      }) => {
        if (oldState === State.ACTIVE) {
          if (translationX > SWIPE_THRESHOLD) {
            Animated.timing(translateX, {
              toValue: width,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              handleSwipeRight(item.id);
            });
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        }
      };

      return (
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
          <Animated.View
            style={[
              styles.profileCard,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <Image source={{ uri: item.photo }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {item.name}, {item.age}
              </Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.bio}>{item.bio}</Text>
            </View>
          </Animated.View>
        </PanGestureHandler>
      );
    },
    [likedProfiles, handleSwipeRight]
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.listContent}>
        {likedProfiles.length > 0 ? (
          <FlatList
            data={likedProfiles}
            keyExtractor={(item) => item.id}
            renderItem={renderProfile}
            style={styles.profileList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't liked any profiles yet</Text>
          </View>
        )}
      </View>
      {/* Footer with navigation */}
      <Footer activeScreen="Likes" />
    </SafeAreaView>
  );
};

// Styles for the LikesScreen component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 70, // Space for footer
  },
  profileList: {
    flex: 1,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: "#444",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
});

export default LikesScreen;