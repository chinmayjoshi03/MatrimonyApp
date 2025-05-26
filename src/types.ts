export type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  religion: string;
  caste: string;
  location: string;
  bio: string;
  photo?: string;
  email?: string;
  phone?: string;
};

export type AuthData = {
  email: string;
  password: string;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Browse: undefined;
  Likes: undefined;
};