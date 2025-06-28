import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList, UserProfile } from '../types';

// Navigation prop type for ProfileScreen
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

// Type definitions for picker options
type Gender = 'Male' | 'Female' | 'Other' | undefined;
type Religion = 'Hindu' | 'Muslim' | 'Christian' | 'Sikh' | 'Jain' | '';
type Caste = string; // Dynamic based on religion
type Location = string; // Dynamic based on predefined options

// Component for viewing and editing user profile
const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    id: 'user',
    name: '',
    age: undefined,
    gender: undefined, // Gender is undefined by default, not ""
    religion: '',
    caste: '',
    location: '',
    bio: '',
    photo: '',
  });

  // Picker options
  const genderOptions: { label: string; value: Gender }[] = [
    { label: 'Select Gender', value: undefined },
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];
  const religionOptions: Religion[] = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain'];
  const casteOptions: { [key: string]: string[] } = {
    Hindu: ['Brahmin', 'Kshatriya', 'Gupta', 'Patel', 'Reddy', 'Nair', 'Kayastha', 'Menon'],
    Muslim: ['Sunni', 'Shia'],
    Christian: ['Catholic'],
    Sikh: ['Jat', 'Arora'],
    Jain: ['Svetambara', 'Digambara'],
  };
  const locationOptions: Location[] = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
  ];

  // Load profile from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        Alert.alert('Error', 'Failed to load profile. Please try again.');
      }
    };
    loadProfile();
  }, []);

  // Save profile to AsyncStorage
  const handleSave = async () => {
    if (!profile.name || !profile.age || !profile.gender || !profile.religion || !profile.location) {
      Alert.alert('Error', 'Please fill all required fields (Name, Age, Gender, Religion, Location).');
      return;
    }
    if (profile.age < 18 || profile.age > 120) {
      Alert.alert('Error', 'Please enter a valid age (18–120).');
      return;
    }

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.formContent}>
        {/* Profile form */}
        <View style={styles.profileForm}>
          {/* Name input */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your name"
            placeholderTextColor="#666"
          />
          {/* Age input */}
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={profile.age ? profile.age.toString() : ''}
            onChangeText={(text) => setProfile({ ...profile, age: parseInt(text) || undefined })}
            placeholder="Enter your age"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          {/* Gender picker */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              selectedValue={profile.gender === '' ? undefined : profile.gender}
              onValueChange={(value: Gender) => setProfile({ ...profile, gender: value })}
              itemStyle={styles.pickerItem}
            >
              {genderOptions.map((option) => (
                <Picker.Item key={option.label} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
          {/* Religion picker */}
          <Text style={styles.label}>Religion</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              selectedValue={profile.religion as Religion | undefined}
              onValueChange={(value: Religion) => setProfile({ ...profile, religion: value, caste: '' })}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select Religion" value="" />
              {religionOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          {/* Caste picker */}
          <Text style={styles.label}>Caste</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              selectedValue={profile.caste}
              onValueChange={(value: Caste) => setProfile({ ...profile, caste: value })}
              enabled={!!profile.religion}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select Caste" value="" />
              {(casteOptions[profile.religion || 'Hindu'] || []).map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          {/* Location picker */}
          <Text style={styles.label}>Location</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              style={styles.picker}
              selectedValue={profile.location}
              onValueChange={(value: Location) => setProfile({ ...profile, location: value })}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select Location" value="" />
              {locationOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          {/* Bio input */}
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            placeholder="Tell us about yourself"
            placeholderTextColor="#666"
            multiline
          />
          {/* Save button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    </View>
  );
};

// Styles for the ProfileScreen component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formContent: {
    padding: 15,
    paddingBottom: 80, // Prevent footer overlap
  },
  profileForm: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
    fontSize: 16,
    color: "#333",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerWrapper: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "white",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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

export default ProfileScreen;