import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation, setIsLoggedIn }) => {
  const [user, setUser] = useState({
    name: 'Guest User',
    email: '',
    phone: '',
    joinDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    orders: 0,
    rewards: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUser(prevUser => ({
          ...prevUser,
          name: parsedData.name || 'Guest User',
          phone: parsedData.mobileNumber || '',
          joinDate: parsedData.loginTime 
            ? new Date(parsedData.loginTime).toLocaleDateString('en-IN', { 
                month: 'short', 
                year: 'numeric' 
              })
            : prevUser.joinDate
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async () => {
            try {
              // Remove user data from AsyncStorage
              await AsyncStorage.removeItem('userData');
              
              // Update the login state to trigger re-render
              setIsLoggedIn(false);
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          } 
        }
      ]
    );
  };

  const menuItems = [
    // { id: 1, icon: 'person-outline', title: 'Personal Information', screen: 'PersonalInfo' },
    // { id: 2, icon: 'location-outline', title: 'Addresses', screen: 'Addresses' },
    // { id: 3, icon: 'receipt-outline', title: 'Order History', screen: 'OrderHistory' },
    // { id: 4, icon: 'card-outline', title: 'Payment Methods', screen: 'Payments' },
    // { id: 5, icon: 'star-outline', title: 'My Reviews', screen: 'Reviews' },
    // { id: 6, icon: 'gift-outline', title: 'Rewards & Offers', screen: 'Rewards' },
    // { id: 7, icon: 'settings-outline', title: 'Settings', screen: 'Settings' },
    // { id: 8, icon: 'help-circle-outline', title: 'Help & Support', screen: 'Support' },
  ];

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
    <View style={styles.container}>
      <Header title="My Profile" showBackButton={true} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitials}>
                {getInitials(user.name)}
              </Text>
            </View>
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            {user.phone ? (
              <Text style={styles.userPhone}>{user.phone}</Text>
            ) : (
              <Text style={styles.userPhone}>Not provided</Text>
            )}
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.orders}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={[styles.statItem, styles.statDivider]}>
                <Text style={styles.statValue}>{user.rewards}</Text>
                <Text style={styles.statLabel}>Rewards</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.joinDate}</Text>
                <Text style={styles.statLabel}>Member Since</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => {
                if (item.screen === 'OrderHistory') {
                  // Navigate to the OrderHistory tab
                  navigation.navigate('OrderHistory');
                } else {
                  // For other screens, navigate normally
                  navigation.navigate(item.screen);
                }
              }}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={22} color="#3b82f6" />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <View style={styles.logoutIconContainer}>
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          </View>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgb(255, 107, 107)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1f2937',
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIconContainer: {
    width: 36,
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutIconContainer: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});

export default ProfileScreen;