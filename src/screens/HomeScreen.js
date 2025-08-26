import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  const featuredCategories = [
    { id: 1, name: 'Fruits & Vegetables', image: 'https://placehold.co/150x150/4CAF50/white?text=Fruits+%26+Veg' },
    { id: 2, name: 'Dairy & Eggs', image: 'https://placehold.co/150x150/2196F3/white?text=Dairy+%26+Eggs' },
    { id: 3, name: 'Bakery', image: 'https://placehold.co/150x150/FF9800/white?text=Bakery' },
    { id: 4, name: 'Beverages', image: 'https://placehold.co/150x150/9C27B0/white?text=Beverages' },
    { id: 5, name: 'Snacks', image: 'https://placehold.co/150x150/E91E63/white?text=Snacks' },
    { id: 6, name: 'Meat & Fish', image: 'https://placehold.co/150x150/F44336/white?text=Meat+%26+Fish' },
  ];

  const allCategories = [
    { id: 1, name: 'Fruits & Vegetables', icon: 'ios-apple' },
    { id: 2, name: 'Dairy & Eggs', icon: 'ios-egg' },
    { id: 3, name: 'Bakery', icon: 'ios-bread' },
    { id: 4, name: 'Beverages', icon: 'ios-cafe' },
    { id: 5, name: 'Snacks', icon: 'ios-fast-food' },
    { id: 6, name: 'Meat & Fish', icon: 'ios-fish' },
    { id: 7, name: 'Frozen Foods', icon: 'ios-snow' },
    { id: 8, name: 'Personal Care', icon: 'ios-person' },
    { id: 9, name: 'Cleaning Supplies', icon: 'ios-brush' },
    { id: 10, name: 'Baby Care', icon: 'ios-body' },
  ];

  const popularProducts = [
    { id: 1, name: 'Gehu', price: '₹199', image: 'https://m.media-amazon.com/images/I/51SWuIREMsL._UF1000,1000_QL80_.jpg' },
    { id: 2, name: 'Fresh Milk', price: '₹60', image: 'https://placehold.co/100x100/2196F3/white?text=Milk' },
    { id: 3, name: 'Whole Wheat Bread', price: '₹45', image: 'https://placehold.co/100x100/FF9800/white?text=Bread' },
    { id: 4, name: 'Orange Juice', price: '₹120', image: 'https://placehold.co/100x100/FF5722/white?text=Juice' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Royal Kirana" />
      
      <ScrollView style={styles.content}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image 
            source={{ uri: 'https://placehold.co/400x200/FF6B6B/white?text=Special+Offers' }}
            style={styles.heroImage}
          />
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Summer Sale!</Text>
            <Text style={styles.heroSubtitle}>Up to 50% off on fresh produce</Text>
          </View>
        </View>

        {/* Featured Categories with Sidebar Toggle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => setSidebarVisible(true)}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featuredCategories.map(category => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Categories')}
              >
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <View style={styles.productGrid}>
            {popularProducts.map(product => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Footer />
      </ScrollView>

      {/* Category Sidebar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.sidebarOverlay}>
          <View style={styles.sidebarContainer}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>All Categories</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSidebarVisible(false)}
              >
                <Ionicons name="ios-close" size={28} color="#000" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sidebarContent}>
              {allCategories.map(category => (
                <TouchableOpacity 
                  key={category.id} 
                  style={styles.sidebarItem}
                  onPress={() => {
                    setSidebarVisible(false);
                    navigation.navigate('Categories', { categoryId: category.id });
                  }}
                >
                  <Ionicons name={category.icon} size={22} color="#3498db" style={styles.sidebarIcon} />
                  <Text style={styles.sidebarItemText}>{category.name}</Text>
                  <Ionicons name="ios-chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');
const sidebarWidth = width * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  heroBanner: {
    position: 'relative',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'white',
    fontSize: 16,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  horizontalScroll: {
    marginHorizontal: -16,
  },
  categoryCard: {
    width: 150,
    marginRight: 16,
    alignItems: 'center',
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  categoryName: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  productImageContainer: {
    width: '100%',
    height: 140,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  productInfo: {
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    // width: '100%',
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  sidebarContainer: {
    width: sidebarWidth,
    height: '100%',
    backgroundColor: 'white',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  sidebarContent: {
    flex: 1,
    padding: 16,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sidebarIcon: {
    marginRight: 12,
  },
  sidebarItemText: {
    flex: 1,
    fontSize: 16,
  },
});

export default HomeScreen;