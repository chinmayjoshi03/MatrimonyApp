import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, UserProfile } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    id: 'user',
    name: '',
    age: 0,
    gender: undefined,
    religion: '',
    caste: '',
    location: '',
    bio: '',
    photo: '',
  });

  const genderOptions = [
    { label: 'Select Gender', value: undefined },
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain'];
  const casteOptions: { [key: string]: string[] } = {
    Hindu: ['Brahmin', 'Kshatriya', 'Gupta', 'Patel', 'Reddy', 'Nair', 'Kayastha', 'Menon'],
    Muslim: ['Sunni', 'Shia'],
    Christian: ['Catholic'],
    Sikh: ['Jat', 'Arora'],
    Jain: ['Svetambara', 'Digambara'],
  };
  const locationOptions = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur'];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfile');
        if (savedProfile) {
          const parsedProfile: Partial<UserProfile> = JSON.parse(savedProfile);
          // Ensure gender is undefined if not set
          if (!parsedProfile.gender) {
            parsedProfile.gender = undefined;
          }
          setProfile(parsedProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      if (!profile.gender) {
        alert('Please select a gender.');
        return;
      }
      
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your name"
          />
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={profile.age ? profile.age.toString() : ''}
            onChangeText={(text) => setProfile({ ...profile, age: parseInt(text) || 0 })}
            placeholder="Enter your age"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={profile.gender}
              onValueChange={(value) => setProfile({ ...profile, gender: value })}
              itemStyle={styles.pickerItem}
            >
              {genderOptions.map((option) => (
                <Picker.Item key={option.label} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Religion</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={profile.religion}
              onValueChange={(value) => setProfile({ ...profile, religion: value, caste: '' })}
              itemStyle={styles.pickerItem}
            >
              {religionOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Caste</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={profile.caste}
              onValueChange={(value) => setProfile({ ...profile, caste: value })}
              enabled={!!profile.religion}
              itemStyle={styles.pickerItem}
            >
              {(casteOptions[profile.religion || 'Hindu'] || []).map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Location</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={profile.location}
              onValueChange={(value) => setProfile({ ...profile, location: value })}
              itemStyle={styles.pickerItem}
            >
              {locationOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            placeholder="Tell us about yourself"
            multiline
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
          style={[styles.footerItem, { backgroundColor: '#FF6B6B' }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person" size={24} color="white" />
          <Text style={[styles.footerText, { color: 'white' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 80, // Prevent footer overlap
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50, // Increased for full text visibility
  },
  pickerItem: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  footerItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default ProfileScreen;