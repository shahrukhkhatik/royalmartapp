import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const featuredCategories = [
    { id: 1, name: 'Fruits & Vegetables', image: 'https://www.slideegg.com/image/catalog/86984-fruit-presentation-powerpoint.png' },
    { id: 2, name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 3, name: 'Bakery', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 4, name: 'Ice Cream', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/cca0d391757687.5e3a07d29c171.png' },
    { id: 5, name: 'Snacks', image: 'https://www.balajiwafers.com/cdn/shop/files/Category-Namkeen-Default.jpg?v=1745240404' },
    // { id: 6, name: 'Meat & Fish', image: 'https://images.unsplash.com/photo-1599457387924-5227cef03613?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  ];

  const allCategories = [
    { id: 1, name: 'Fruits & Vegetables', icon: 'apple' },
    { id: 2, name: 'Dairy & Eggs', icon: 'egg' },
    { id: 3, name: 'Bakery', icon: 'bread' },
    { id: 4, name: 'Beverages', icon: 'cafe' },
    { id: 5, name: 'Snacks', icon: 'fast-food' },
    { id: 6, name: 'Meat & Fish', icon: 'fish' },
    { id: 7, name: 'Frozen Foods', icon: 'snow' },
    { id: 8, name: 'Personal Care', icon: 'person' },
    { id: 9, name: 'Cleaning Supplies', icon: 'brush' },
    { id: 10, name: 'Baby Care', icon: 'body' },
  ];

  const popularProducts = [
    { id: 1, name: 'Organic Wheat', price: '₹199', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoGs48QqBWanDgJnNQVsUoUhDEv0PWRFbMMw&s' },
    { id: 2, name: 'Fresh Milk', price: '₹60', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 3, name: 'Whole Wheat Bread', price: '₹45', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 4, name: 'Orange Juice', price: '₹120', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  ];

  // Auto slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === featuredCategories.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Royal Kirana" />
      
      <ScrollView style={styles.content}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
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
          
          {/* Slider for categories */}
          <View style={styles.sliderContainer}>
            <View style={styles.slider}>
              {featuredCategories.map((category, index) => (
                <TouchableOpacity 
                  key={category.id} 
                  style={[
                    styles.categoryCard,
                    { display: index === currentSlide ? 'flex' : 'none' }
                  ]}
                  onPress={() => navigation.navigate('Categories')}
                >
                  <Image source={{ uri: category.image }} style={styles.categoryImage} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Slider indicators */}
            <View style={styles.sliderIndicators}>
              {featuredCategories.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.indicator,
                    index === currentSlide ? styles.activeIndicator : styles.inactiveIndicator
                  ]} 
                />
              ))}
            </View>
          </View>
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
                <Ionicons name="close" size={28} color="#000" />
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
                  <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  sliderContainer: {
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCard: {
    width: '100%',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  categoryName: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  sliderIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#3498db',
    width: 12,
  },
  inactiveIndicator: {
    backgroundColor: '#ccc',
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