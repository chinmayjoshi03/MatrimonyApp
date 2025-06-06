import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, Animated, SafeAreaView } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

const LikesScreen: React.FC = () => {
  const [likedProfiles, setLikedProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    const loadLikedProfiles = async () => {
      try {
        const savedLiked = await AsyncStorage.getItem('likedProfiles');
        if (savedLiked) {
          setLikedProfiles(JSON.parse(savedLiked) || []);
        }
      } catch (error) {
        console.error('Error loading liked profiles:', error);
      }
    };
    loadLikedProfiles();
  }, []);

  const handleSwipeRight = async (profileId: string) => {
    const newLikedProfiles = likedProfiles.filter(profile => profile.id !== profileId);
    setLikedProfiles(newLikedProfiles);
    try {
      await AsyncStorage.setItem('likedProfiles', JSON.stringify(newLikedProfiles));
    } catch (error) {
      console.error('Error updating liked profiles:', error);
    }
  };

  const renderProfile = ({ item }: { item: UserProfile }) => {
    const translateX = new Animated.Value(0);

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = (event: any) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const { translationX } = event.nativeEvent;
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
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.profileCard,
            { transform: [{ translateX }] }
          ]}
        >
          <Image source={{ uri: item.photo }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{item.name}, {item.age}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={styles.bio}>{item.bio}</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {likedProfiles.length > 0 ? (
          <FlatList
            data={likedProfiles}
            keyExtractor={(item) => item.id}
            renderItem={renderProfile}
            style={styles.list}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't liked any profiles yet</Text>
          </View>
        )}
      </View>
      <Footer activeScreen="Likes" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 70, // Space for footer
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: '#444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});

export default LikesScreen;