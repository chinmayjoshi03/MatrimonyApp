import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

const mockProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 27,
    gender: 'Female',
    religion: 'Hindu',
    caste: 'Brahmin',
    location: 'Mumbai',
    bio: 'Software engineer who loves traveling and cooking',
    photo: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    name: 'Rahul Patel',
    age: 30,
    gender: 'Male',
    religion: 'Hindu',
    caste: 'Patel',
    location: 'Ahmedabad',
    bio: 'Business owner with passion for music and sports',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '3',
    name: 'Ananya Gupta',
    age: 25,
    gender: 'Female',
    religion: 'Hindu',
    caste: 'Gupta',
    location: 'Delhi',
    bio: 'Doctor who enjoys reading and painting',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '4',
    name: 'Vikram Singh',
    age: 32,
    gender: 'Male',
    religion: 'Sikh',
    caste: 'Jat',
    location: 'Punjab',
    bio: 'Army officer looking for a life partner',
    photo: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '5',
    name: 'Neha Reddy',
    age: 28,
    gender: 'Female',
    religion: 'Hindu',
    caste: 'Reddy',
    location: 'Hyderabad',
    bio: 'Architect with love for design and photography',
    photo: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
];

const BrowseScreen = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(mockProfiles);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRejected = await AsyncStorage.getItem('rejectedProfiles');
        const savedLiked = await AsyncStorage.getItem('likedProfiles');
        
        if (savedRejected) {
          setRejectedIds(JSON.parse(savedRejected));
        }
        
        if (savedLiked) {
          setLikedProfiles(JSON.parse(savedLiked));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const translateX = new Animated.Value(0);
  const rotate = translateX.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      if (translationX > SWIPE_THRESHOLD) {
        handleSwipeRight();
      } else if (translationX < -SWIPE_THRESHOLD) {
        handleSwipeLeft();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true
        }).start();
      }
    }
  };

  const handleSwipeRight = async () => {
    Animated.timing(translateX, {
      toValue: width,
      duration: 200,
      useNativeDriver: true
    }).start(async () => {
      const swipedProfile = profiles[currentIndex];
      const newLikedProfiles = [...likedProfiles, swipedProfile];
      setLikedProfiles(newLikedProfiles);
      await AsyncStorage.setItem('likedProfiles', JSON.stringify(newLikedProfiles));
      setCurrentIndex(prev => prev + 1);
      translateX.setValue(0);
    });
  };

  const handleSwipeLeft = async () => {
    Animated.timing(translateX, {
      toValue: -width,
      duration: 200,
      useNativeDriver: true
    }).start(async () => {
      const swipedProfile = profiles[currentIndex];
      const newRejectedIds = [...rejectedIds, swipedProfile.id];
      setRejectedIds(newRejectedIds);
      await AsyncStorage.setItem('rejectedProfiles', JSON.stringify(newRejectedIds));
      setCurrentIndex(prev => prev + 1);
      translateX.setValue(0);
    });
  };

  const filteredProfiles = profiles.filter(profile => !rejectedIds.includes(profile.id));

  return (
    <View style={styles.container}>
      {currentIndex < filteredProfiles.length ? (
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  { translateX: translateX },
                  { rotate: rotate }
                ]
              }
            ]}
          >
            <Image source={{ uri: filteredProfiles[currentIndex].photo }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>
                {filteredProfiles[currentIndex].name}, {filteredProfiles[currentIndex].age}
              </Text>
              <Text style={styles.cardLocation}>
                {filteredProfiles[currentIndex].location}
              </Text>
              <Text style={styles.cardBio}>
                {filteredProfiles[currentIndex].bio}
              </Text>
            </View>
          </Animated.View>
        </PanGestureHandler>
      ) : (
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>No more profiles to show</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardInfo: {
    padding: 20,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  cardBio: {
    fontSize: 14,
    color: '#444',
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: 18,
    color: '#666',
  },
});

export default BrowseScreen;