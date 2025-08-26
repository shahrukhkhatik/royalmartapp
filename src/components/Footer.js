import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const openURL = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <Text style={styles.footerHeading}>Royal Kirana Store</Text>
        <Text style={styles.footerText}>Your one-stop shop for all grocery needs</Text>
        
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => openURL('https://example.com/about')}>
            <Text style={styles.footerLink}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openURL('https://example.com/contact')}>
            <Text style={styles.footerLink}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openURL('https://example.com/privacy')}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openURL('https://example.com/terms')}>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.socialIcons}>
          <TouchableOpacity 
            style={styles.socialIcon} 
            onPress={() => openURL('https://facebook.com')}
          >
            <Ionicons name="logo-facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialIcon}
            onPress={() => openURL('https://instagram.com')}
          >
            <Ionicons name="logo-instagram" size={24} color="#E1306C" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialIcon}
            onPress={() => openURL('https://twitter.com')}
          >
            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialIcon}
            onPress={() => openURL('https://youtube.com')}
          >
            <Ionicons name="logo-youtube" size={24} color="#FF0000" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.copyright}>
          © {currentYear} Royal Kirana Store. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 14,
    color: '#007bff',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  socialIcon: {
    marginHorizontal: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#999',
  },
});

export default Footer;