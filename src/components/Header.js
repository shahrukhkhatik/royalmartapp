import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// In your Header component
const Header = ({ 
  title, 
  showBackButton = false, 
  onBackPress, 
  showCart = true, 
  cartItemCount = 0, 
}) => {

  const navigation = useNavigation(); // Use the hook here

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleMenuPress = () => {
    // Add menu functionality here, e.g., opening a drawer
    console.log('Menu pressed');
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBackButton ? (
          <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleMenuPress} style={styles.iconButton}>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.centerSection}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      
      <View style={styles.rightSection}>
        {showCart && (
          <TouchableOpacity onPress={handleCartPress} style={styles.iconButton}>
            <Ionicons name="cart" size={24} color="black" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 40,
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
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'tomato',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;