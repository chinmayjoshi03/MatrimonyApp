import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    age: 0,
    gender: 'Male',
    religion: '',
    caste: '',
    location: '',
    bio: '',
    photo: undefined,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

   const handleSave = async () => {
    if (!profile.name || !profile.age || !profile.religion || !profile.caste || !profile.location) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await AsyncStorage.setItem('profileComplete', 'true');
      navigation.navigate('Browse'); // Navigate to Browse screen after saving
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, photo: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {profile.photo ? (
          <Image source={{ uri: profile.photo }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePlaceholder}>Add Photo</Text>
        )}
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={profile.name}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={profile.age.toString()}
        onChangeText={(text) => setProfile({ ...profile, age: parseInt(text) || 0 })}
        keyboardType="numeric"
      />
      
      <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Gender:</Text>
        <TouchableOpacity
          style={[styles.radioButton, profile.gender === 'Male' && styles.radioSelected]}
          onPress={() => setProfile({ ...profile, gender: 'Male' })}
        >
          <Text>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, profile.gender === 'Female' && styles.radioSelected]}
          onPress={() => setProfile({ ...profile, gender: 'Female' })}
        >
          <Text>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, profile.gender === 'Other' && styles.radioSelected]}
          onPress={() => setProfile({ ...profile, gender: 'Other' })}
        >
          <Text>Other</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Religion"
        value={profile.religion}
        onChangeText={(text) => setProfile({ ...profile, religion: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Caste"
        value={profile.caste}
        onChangeText={(text) => setProfile({ ...profile, caste: text })}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={profile.location}
        onChangeText={(text) => setProfile({ ...profile, location: text })}
      />
      
      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="Short Bio"
        value={profile.bio}
        onChangeText={(text) => setProfile({ ...profile, bio: text })}
        multiline
        numberOfLines={4}
      />
      
         
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? 'Saving...' : 'Save Profile & Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioLabel: {
    marginRight: 10,
  },
  radioButton: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  radioSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;

