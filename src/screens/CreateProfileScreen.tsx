import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Navigation prop type for ProfileCreationScreen
type ProfileCreationNavigationProp = StackNavigationProp<RootStackParamList, 'CreateProfile'>;

// Type definitions for form fields
type Gender = 'male' | 'female' | 'other' | '';
type Religion = 'hinduism' | 'islam' | 'christianity' | 'sikhism' | 'buddhism' | 'jainism' | 'other' | '';
type Caste = 'brahmin' | 'kshatriya' | 'vaishya' | 'shudra' | 'other' | '';

// Props interface for ProfileCreationScreen
interface ProfileCreationProps {
  navigation: ProfileCreationNavigationProp;
}

// Component for creating a user profile with form inputs and image upload
const ProfileCreationScreen: React.FC<ProfileCreationProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('');
  const [religion, setReligion] = useState<Religion>('');
  const [caste, setCaste] = useState<Caste>('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Request permission and pick an image from the library
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Please grant permission to access your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Validate and submit profile data
  const handleSubmit = () => {
    if (!name || !age || !gender || !religion || !caste || !location) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 120) {
      Alert.alert('Error', 'Please enter a valid age (18–120)');
      return;
    }

    // TODO: Save profile data (e.g., to AsyncStorage or backend)
    navigation.navigate('Browse');
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.formContent}>
        {/* Name input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Age input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        {/* Gender picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue: Gender) => setGender(itemValue)}
              style={styles.picker}
              dropdownIconColor="#666"
            >
              <Picker.Item label="Select gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {/* Religion picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Religion</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={religion}
              onValueChange={(itemValue: Religion) => setReligion(itemValue)}
              style={styles.picker}
              dropdownIconColor="#666"
            >
              <Picker.Item label="Select religion" value="" />
              <Picker.Item label="Hinduism" value="hinduism" />
              <Picker.Item label="Islam" value="islam" />
              <Picker.Item label="Christianity" value="christianity" />
              <Picker.Item label="Sikhism" value="sikhism" />
              <Picker.Item label="Buddhism" value="buddhism" />
              <Picker.Item label="Jainism" value="jainism" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {/* Caste picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Caste</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={caste}
              onValueChange={(itemValue: Caste) => setCaste(itemValue)}
              style={styles.picker}
              dropdownIconColor="#666"
            >
              <Picker.Item label="Select caste" value="" />
              <Picker.Item label="Brahmin" value="brahmin" />
              <Picker.Item label="Kshatriya" value="kshatriya" />
              <Picker.Item label="Vaishya" value="vaishya" />
              <Picker.Item label="Shudra" value="shudra" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {/* Location input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            placeholderTextColor="#666"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Bio input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Short Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Tell us a little about yourself"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
          />
        </View>

        {/* Profile picture upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Profile Picture</Text>
          <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={36} color="#666" />
                <Text style={styles.imageUploadTitle}>Add Profile Picture</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the ProfileCreationScreen component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formContent: {
    padding: 16,
    paddingBottom: 80,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 48,
    color: "#333",
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  imageUploadContainer: {
    alignItems: "center",
    padding: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  imagePlaceholder: {
    alignItems: "center",
    padding: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imageUploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  submitButton: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#FF6B6B",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default ProfileCreationScreen;