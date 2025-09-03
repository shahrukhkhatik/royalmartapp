// src/components/Header.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Sidebar from './Sidebar';


const Header = ({ 
  title, 
  showBackButton = false, 
  onBackPress, 
}) => {
  const navigation = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0); // Add a key to force re-render


  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // Refresh sidebar when opening to get latest user data
    if (!sidebarOpen) {
      setSidebarKey(prev => prev + 1);
    }
  };


  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };


  return (
    <>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
              {/* ✅ White Back Arrow */}
              <Ionicons name="arrow-back" size={24} color="rgb(255, 107, 107)" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
              {/* ✅ White Menu Icon */}
              <Ionicons name="menu" size={24} color="rgb(255, 107, 107)" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerSection}>
          {/* ✅ White Title */}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity onPress={handleProfilePress} style={styles.iconButton}>
            {/* ✅ White Profile Icon */}
            <Ionicons name="person" size={24} color="rgb(255, 107, 107)" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Sidebar 
        key={sidebarKey} // This will force re-render when key changes
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </>
  );
};


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: 'rgb(255, 254, 248)',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 40,
    zIndex: 10,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(255, 107, 107)',   // ✅ Title now white
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
});


export default Header;
