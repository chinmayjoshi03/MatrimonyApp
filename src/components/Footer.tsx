import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type FooterNavigationProp = StackNavigationProp<RootStackParamList>;

interface FooterProps {
  activeScreen: keyof RootStackParamList;
}

const Footer: React.FC<FooterProps> = ({ activeScreen }) => {
  const navigation = useNavigation<FooterNavigationProp>();

  const navItems = [
    { name: 'Browse', icon: 'explore', screen: 'Browse' as const },
    { name: 'Likes', icon: 'favorite', screen: 'Likes' as const },
    { name: 'Messages', icon: 'message', screen: 'Messages' as const },
    { name: 'Profile', icon: 'person', screen: 'Profile' as const },
  ];

  return (
    <View style={styles.footer}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={[
            styles.footerItem,
            activeScreen === item.screen && { backgroundColor: '#FF6B6B' },
          ]}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Icon
            name={item.icon}
            size={24}
            color={activeScreen === item.screen ? 'white' : '#666'}
          />
          <Text
            style={[
              styles.footerText,
              activeScreen === item.screen && { color: 'white' },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Footer;