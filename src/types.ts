// Type for user profile data
export type UserProfile = {
  // Unique identifier for the user
  id: string;
  // User's full name
  name: string;
  // User's age (recommended 18–120)
  age: number;
  // User's gender, empty string for unselected
  gender: 'Male' | 'Female' | 'Other' | '';
  // User's religion
  religion: string;
  // User's caste or community
  caste: string;
  // User's city or location
  location: string;
  // User's bio or description
  bio: string;
  // Optional URL or path to profile photo
  photo?: string;
  // Optional email address
  email?: string;
  // Optional phone number
  phone?: string;
};

// Type for authentication data
export type AuthData = {
  // User's email address
  email: string;
  // User's password
  password: string;
  // Optional phone number for mobile login
  phone?: string;
};

// Type for navigation stack parameters
export type RootStackParamList = {
  // Onboarding screen (no parameters)
  Onboarding: undefined;
  // Login screen (no parameters)
  Login: undefined;
  // Register screen (no parameters)
  Register: undefined;
  // Profile screen for viewing/editing user profile
  Profile: undefined;
  // Browse screen for viewing profiles
  Browse: undefined;
  // Likes screen for viewing liked profiles
  Likes: undefined;
  // CreateProfile screen for initial profile setup
  CreateProfile: undefined;
  // Messages screen for viewing conversations
  Messages: undefined;
  // Chat screen with user ID parameter
  Chat: { userId: string };
};