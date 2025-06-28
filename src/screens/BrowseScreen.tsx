import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserProfile, mockProfiles } from '../profiles';
import { RootStackParamList } from '../types';

// Screen dimensions and swipe threshold
const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

type BrowseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Browse'>;

// Component for browsing profiles with swipe gestures and filtering
const BrowseScreen: React.FC = () => {
  const navigation = useNavigation<BrowseScreenNavigationProp>();

  // State for profiles, user interactions, and UI
  const [profiles, setProfiles] = useState<UserProfile[]>(mockProfiles);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileFilters, setProfileFilters] = useState({
    age: '',
    religion: '',
    caste: '',
    location: '',
  });
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [userGender, setUserGender] = useState<string>('Male');

  // Filter options for modals
  const ageOptions = ['Any', '20-25', '26-30', '31-35'];
  const religionOptions = ['Any', 'Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain'];
  const casteOptions: { [key: string]: string[] } = {
    Any: ['Any'],
    Hindu: ['Any', 'Brahmin', 'Kshatriya', 'Gupta', 'Patel', 'Reddy', 'Nair', 'Kayastha', 'Menon'],
    Muslim: ['Any', 'Sunni', 'Shia'],
    Christian: ['Any', 'Catholic'],
    Sikh: ['Any', 'Jat', 'Arora'],
    Jain: ['Any', 'Svetambara', 'Digambara'],
  };
  const locationOptions = [
    'Any',
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

  // Load persisted data and configure navigation header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Browse',
      headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
            <Icon name="search" size={24} color="#333" style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
            <Icon name="filter-list" size={24} color="#333" style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      ),
    });

    // Load rejected profiles, liked profiles, and user gender
    const loadData = async () => {
      try {
        const savedRejected = await AsyncStorage.getItem('rejectedProfiles');
        const savedLiked = await AsyncStorage.getItem('likedProfiles');
        const savedUserProfile = await AsyncStorage.getItem('userProfile');

        if (savedRejected) {
          setRejectedIds(JSON.parse(savedRejected));
        }
        if (savedLiked) {
          setLikedProfiles(JSON.parse(savedLiked));
        }
        if (savedUserProfile) {
          const userProfile: UserProfile = JSON.parse(savedUserProfile);
          setUserGender(userProfile.gender || 'Male');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        // TODO: Show user-friendly error message
      }
    };

    loadData();
  }, [navigation]);

  // Animation for swipe gestures
  const translateX = new Animated.Value(0);
  const rotate = translateX.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

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
        handleSwipeRight();
      } else if (translationX < -SWIPE_THRESHOLD) {
        handleSwipeLeft();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  // Handle right swipe (like)
  const handleSwipeRight = async () => {
    Animated.timing(translateX, {
      toValue: width,
      duration: 200,
      useNativeDriver: true,
    }).start(async () => {
      const swipedProfile = filteredProfiles[currentIndex];
      if (swipedProfile) {
        const updatedLikedProfiles = [...likedProfiles, swipedProfile];
        setLikedProfiles(updatedLikedProfiles);
        await AsyncStorage.setItem('likedProfiles', JSON.stringify(updatedLikedProfiles));
        setCurrentIndex((prev) => prev + 1);
        translateX.setValue(0);
      }
    });
  };

  // Handle left swipe (reject)
  const handleSwipeLeft = async () => {
    Animated.timing(translateX, {
      toValue: -width,
      duration: 200,
      useNativeDriver: true,
    }).start(async () => {
      const swipedProfile = filteredProfiles[currentIndex];
      if (swipedProfile) {
        const updatedRejectedIds = [...rejectedIds, swipedProfile.id];
        setRejectedIds(updatedRejectedIds);
        await AsyncStorage.setItem('rejectedProfiles', JSON.stringify(updatedRejectedIds));
        setCurrentIndex((prev) => prev + 1);
        translateX.setValue(0);
      }
    });
  };

  // Memoized filtered profiles to optimize performance
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (rejectedIds.includes(profile.id)) return false;
      if (userGender === 'Male' && profile.gender !== 'Female') return false;
      if (userGender === 'Female' && profile.gender !== 'Male') return false;
      if (searchQuery && !profile.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (profileFilters.age && profileFilters.age !== 'Any') {
        const [min, max] = profileFilters.age.split('-').map(Number);
        if (profile.age < min || profile.age > max) return false;
      }
      if (
        profileFilters.religion &&
        profileFilters.religion !== 'Any' &&
        profile.religion !== profileFilters.religion
      ) {
        return false;
      }
      if (
        profileFilters.caste &&
        profileFilters.caste !== 'Any' &&
        profile.caste !== profileFilters.caste
      ) {
        return false;
      }
      if (
        profileFilters.location &&
        profileFilters.location !== 'Any' &&
        profile.location !== profileFilters.location
      ) {
        return false;
      }
      return true;
    });
  }, [profiles, rejectedIds, userGender, searchQuery, profileFilters]);

  // Apply filters and close modal
  const handleApplyFilters = () => {
    setCurrentIndex(0);
    setFilterModalVisible(false);
  };

  // Clear filters and reset index
  const handleClearFilters = () => {
    setProfileFilters({ age: '', religion: '', caste: '', location: '' });
    setCurrentIndex(0);
  };

  return (
    <View style={styles.screenContainer}>
      {/* Search modal for filtering by name */}
      <Modal
        isVisible={isSearchModalVisible}
        onBackdropPress={() => setSearchModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Search Profiles</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setSearchModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Filter modal for advanced profile filtering */}
      <Modal
        isVisible={isFilterModalVisible}
        onBackdropPress={() => setFilterModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Profiles</Text>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Age:</Text>
            <Picker
              style={styles.picker}
              selectedValue={profileFilters.age}
              onValueChange={(value) => setProfileFilters({ ...profileFilters, age: value })}
            >
              {ageOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Religion:</Text>
            <Picker
              style={styles.picker}
              selectedValue={profileFilters.religion}
              onValueChange={(value) =>
                setProfileFilters({ ...profileFilters, religion: value, caste: 'Any' })
              }
            >
              {religionOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Caste:</Text>
            <Picker
              style={styles.picker}
              selectedValue={profileFilters.caste}
              onValueChange={(value) => setProfileFilters({ ...profileFilters, caste: value })}
              enabled={profileFilters.religion !== '' && profileFilters.religion !== 'Any'}
            >
              {(casteOptions[profileFilters.religion || 'Any'] || ['Any']).map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Location:</Text>
            <Picker
              style={styles.picker}
              selectedValue={profileFilters.location}
              onValueChange={(value) => setProfileFilters({ ...profileFilters, location: value })}
            >
              {locationOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={handleClearFilters}
            >
              <Text style={styles.modalButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleApplyFilters}>
              <Text style={styles.modalButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile card with swipe functionality */}
      {currentIndex < filteredProfiles.length ? (
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
          <Animated.View
            style={[
              styles.profileCard,
              {
                transform: [{ translateX }, { rotate }],
              },
            ]}
          >
            <Image
              source={{ uri: filteredProfiles[currentIndex]?.photo }}
              style={styles.cardImage}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>
                {filteredProfiles[currentIndex]?.name}, {filteredProfiles[currentIndex]?.age}
              </Text>
              <Text style={styles.cardDetails}>
                {filteredProfiles[currentIndex]?.religion} | {filteredProfiles[currentIndex]?.caste}
              </Text>
              <Text style={styles.cardLocation}>
                {filteredProfiles[currentIndex]?.location}
              </Text>
              <Text style={styles.cardBio}>{filteredProfiles[currentIndex]?.bio}</Text>
            </View>
          </Animated.View>
        </PanGestureHandler>
      ) : (
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>No more profiles to show</Text>
        </View>
      )}

      {/* Action buttons for swipe actions */}
      {currentIndex < filteredProfiles.length && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSwipeLeft}>
            <Icon name="close" size={30} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSwipeRight}>
            <Icon name="favorite" size={30} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom navigation bar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Browse')}
        >
          <Icon name="explore" size={24} color="#FF6B6B" />
          <Text style={[styles.footerText, { color: '#FF6B6B' }]}>Browse</Text>
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

// Styles for the BrowseScreen component
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 10,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  filterItem: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: "#666",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileCard: {
    width: "90%",
    height: "70%",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: "center",
    marginVertical: 20,
  },
  cardImage: {
    width: "100%",
    height: "65%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardInfo: {
    padding: 20,
  },
  cardName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  cardDetails: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  cardBio: {
    fontSize: 14,
    color: "#444",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  noMoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMoreText: {
    fontSize: 18,
    color: "#666",
  },
});

export default BrowseScreen;