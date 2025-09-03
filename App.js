import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CartScreen from './src/screens/CartScreen';
import SubCategoryScreen from './src/screens/SubCategoryScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import LoginScreen from './src/screens/LoginScreen';

const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabNavigator({ setIsLoggedIn }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'SubCategories') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'OrderHistory') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'rgb(255, 107, 107)',
        tabBarInactiveTintColor: 'rgb(255, 107, 107)',
        tabBarStyle: {
          height: 80,
          backgroundColor: 'rgb(255, 254, 248)',
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="SubCategories"
        component={SubCategoryScreen}
        options={{
          headerShown: false,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarItemStyle: { display: 'none' },
        }}
      >
        {() => <ProfileScreen setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ 
          headerShown: false,
          title: 'My Orders'
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      setIsLoggedIn(!!userData);
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabNavigator setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <LoginScreen setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
}