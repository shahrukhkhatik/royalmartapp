// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: 'Guest User',
    mobileNumber: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const parsedData = JSON.parse(userDataString);
        setUserData({
          name: parsedData.name || 'Guest User',
          mobileNumber: parsedData.mobileNumber || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data in sidebar:', error);
    }
  };

  const menuItems = [
    { id: 1, name: 'Profile', icon: 'person', screen: 'Profile' },
    // { id: 2, name: 'View Call', icon: 'call', screen: 'ViewCall' },
    // { id: 3, name: 'Refer', icon: 'share-social', screen: 'Refer' },
    // { id: 4, name: 'Rate on Play Store', icon: 'star', screen: 'Rate' },
    // { id: 5, name: 'Notification', icon: 'notifications', screen: 'Notification' },
    { id: 6, name: 'Help', icon: 'help-circle', screen: 'Help' },
    { id: 7, name: 'Log Out', icon: 'log-out', screen: 'Logout' },
  ];

  const handleMenuItemPress = (screen) => {
    onClose();
    if (screen === 'Logout') {
      // Handle logout logic
      navigation.navigate('Profile');
      AsyncStorage.getItem('orderHistory');
    }
    else{
      navigation.navigate('Profile');
    }
  };

  // Generate initials for profile image
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {isOpen && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View style={[
        styles.sidebar,
        {
          transform: [{
            translateX: isOpen ? 0 : -width
          }]
        }
      ]}>
        <SafeAreaView style={styles.sidebarContent}>
          <View style={styles.profileSection}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitials}>
                {getInitials(userData.name)}
              </Text>
            </View>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileEmail}>
              {userData.mobileNumber || 'No mobile number'}
            </Text>
          </View>

          <ScrollView style={styles.menuItems}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.screen)}
              >
                <Ionicons name={item.icon} size={22} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 20,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: '100%',
    backgroundColor: 'white',
    zIndex: 30,
    elevation: 5,
  },
  sidebarContent: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
    top: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgb(255, 107, 107)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileInitials: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  menuItems: {
    flex: 1,
    paddingVertical: 10,
    top: 50,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Sidebar;