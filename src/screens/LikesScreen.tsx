import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { UserProfile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LikesScreen = () => {
  const [likedProfiles, setLikedProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    const loadLikedProfiles = async () => {
      try {
        const savedLiked = await AsyncStorage.getItem('likedProfiles');
        if (savedLiked) {
          setLikedProfiles(JSON.parse(savedLiked));
        }
      } catch (error) {
        console.error('Error loading liked profiles:', error);
      }
    };
    loadLikedProfiles();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Liked Profiles</Text>
      
      {likedProfiles.length > 0 ? (
        <FlatList
          data={likedProfiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.profileCard}>
              <Image source={{ uri: item.photo }} style={styles.profileImage} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{item.name}, {item.age}</Text>
                <Text style={styles.profileLocation}>{item.location}</Text>
                <Text style={styles.profileBio}>{item.bio}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't liked any profiles yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  profileBio: {
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