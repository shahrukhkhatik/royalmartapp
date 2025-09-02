import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';  // <-- Gradient Background

const LoginScreen = ({ setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      // Save user data to AsyncStorage
      const userData = {
        name: name.trim(),
        mobileNumber: mobileNumber.trim(),
        loginTime: new Date().toISOString()
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save data. Please try again.');
      console.error('Error saving data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Gradient Header */}
          <LinearGradient
            colors={['#FF6A0087', '#FF3B3BF5']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/Brand_Logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              {/* <Text style={styles.headerText}>A whole grocery store{'\n'}at your fingertips</Text> */}
            </View>
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                maxLength={50}
                placeholderTextColor="#999"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.mobileNumber && styles.inputError]}
                placeholder="Enter your 10-digit mobile number"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor="#999"
              />
              {errors.mobileNumber ? (
                <Text style={styles.errorText}>{errors.mobileNumber}</Text>
              ) : null}
            </View>

            {/* Sign In Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButtonFB}>
                <Text style={styles.socialText}>f</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButtonGoogle}>
                <Text style={styles.socialTextG}>G</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <Text style={styles.signupText}>
              You have any problem ?{' '}
              <Text style={styles.signupLink}>Contact us</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerGradient: {
    height: 250,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    tintColor: '#ffffff',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
  },
  form: {
    padding: 30,
    marginTop: 35,
  },
  inputContainer: {
    marginBottom: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: 'rgb(255, 107, 107)',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    width: '50%',
    alignSelf: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  socialButtonFB: {
    backgroundColor: '#3b5998',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
  },
  socialButtonGoogle: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  socialText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  socialTextG: {
    color: '#DB4437',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    color: '#ff3b3b',
    fontWeight: '600',
  },
});

export default LoginScreen;
