import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

type Gender = 'male' | 'female' | 'other' | '';
type Religion = 'hinduism' | 'islam' | 'christianity' | 'sikhism' | 'buddhism' | 'jainism' | 'other' | '';
type Caste = 'brahmin' | 'kshatriya' | 'vaishya' | 'shudra' | 'other' | '';

const ProfileCreationScreen = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('');
  const [religion, setReligion] = useState<Religion>('');
  const [caste, setCaste] = useState<Caste>('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name || !age || !gender || !religion || !caste || !location) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Here you would typically save the profile data
    // Then navigate to the next screen
    navigation.navigate('Browse');
  };

  return (
    <View style={styles.container}>
      

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#8b5b5d"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor="#8b5b5d"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue: Gender) => setGender(itemValue)}
              style={styles.picker}
              dropdownIconColor="#8b5b5d"
            >
              <Picker.Item label="Select gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Religion</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={religion}
              onValueChange={(itemValue: Religion) => setReligion(itemValue)}
              style={styles.picker}
              dropdownIconColor="#8b5b5d"
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Caste</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={caste}
              onValueChange={(itemValue: Caste) => setCaste(itemValue)}
              style={styles.picker}
              dropdownIconColor="#8b5b5d"
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            placeholderTextColor="#8b5b5d"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Short Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Tell us a little about yourself"
            placeholderTextColor="#8b5b5d"
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Profile Picture</Text>
          <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={36} color="#8b5b5d" />
              </View>
            )}
            <View style={styles.imageUploadText}>
              <Text style={styles.imageUploadTitle}>Add Profile Picture</Text>
              <Text style={styles.imageUploadSubtitle}>Upload a clear photo of yourself</Text>
            </View>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e3d4d5',
    backgroundColor: '#fbf9f9',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#191011',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a3b3c',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3d4d5',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#191011',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3d4d5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    color: '#191011',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  imageUploadContainer: {
    alignItems: 'center',
    padding: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e3d4d5',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#f1e9ea',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imageUploadText: {
    alignItems: 'center',
    marginVertical: 8,
  },
  imageUploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#191011',
    marginBottom: 4,
  },
  imageUploadSubtitle: {
    fontSize: 14,
    color: '#4a3b3c',
    textAlign: 'center',
  },
  uploadButton: {
    minWidth: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1e9ea',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#191011',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e3d4d5',
    backgroundColor: '#fbf9f9',
  },
  submitButton: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#e8b4b7',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#191011',
  },
});

export default ProfileCreationScreen;