import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions, SafeAreaView, Alert } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const featuredCategories = [
    { id: 1, name: 'Fruits & Vegetables', image: 'https://www.slideegg.com/image/catalog/86984-fruit-presentation-powerpoint.png' },
    { id: 2, name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 3, name: 'Bakery', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 4, name: 'Ice Cream', image: 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/cca0d391757687.5e3a07d29c171.png' },
    { id: 5, name: 'Snacks', image: 'https://www.balajiwafers.com/cdn/shop/files/Category-Namkeen-Default.jpg?v=1745240404' },
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
  { id: 1, name: 'Organic Wheat', category: 'Grains', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoGs48QqBWanDgJnNQVsUoUhDEv0PWRFbMMw&s' },
  { id: 2, name: 'Fresh Milk', category: 'Dairy', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://www.bbassets.com/media/uploads/p/l/40148717_4-akshayakalpa-amrutha-a2-farm-fresh-milk-organic.jpg' },
  { id: 3, name: 'Whole Wheat Bread', category: 'Bakery', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Orange Juice', category: 'Beverages', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 5, name: 'Basmati Rice', category: 'Grains', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW2bcJj8jgiZ9THfbu_1LfQimB_t3hl_yejQ&s' },
  { id: 6, name: 'Honey', category: 'Grocery', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB9vidPJnZtlT7If35oElKJN6GjltGJMI4Nw&s' },
  { id: 7, name: 'Tomato Ketchup', category: 'Grocery', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://www.bbassets.com/media/uploads/p/xl/40029538_39-kissan-fresh-tomato-ketchup.jpg' },
  { id: 8, name: 'Potato Chips', category: 'Snacks', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZIzxgXwrWGSUq58no9DKLNQQFrg-MhZyoXw&s' },
  { id: 9, name: 'Cooking Oil', category: 'Grocery', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTRaHF6kdjaJHnlR-VSj6Lrz1Qm6p-yeXzEw&s' },
  { id: 10, name: 'Butter', category: 'Dairy', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://5.imimg.com/data5/QS/RE/GLADMIN-45635670/amul-butter-500x500.png' },
  { id: 11, name: 'Pasta', category: 'Grocery', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://www.bbassets.com/media/uploads/p/l/40180804_7-maggi-pazzta-masala-penne-family-saver-pack.jpg' },
  { id: 12, name: 'Tea', category: 'Beverages', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://cdn.shopify.com/s/files/1/1498/3056/files/homeDarjImg.jpg?v=1629298964' },
  { id: 13, name: 'Coffee', category: 'Beverages', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://images-cdn.ubuy.co.in/67470f2347239015f14dd59c-nescafe-clasico-instant-coffee.jpg' },
  { id: 14, name: 'Biscuits', category: 'Snacks', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_304/NI_CATALOG/IMAGES/CIW/2025/4/21/6405bd22-5117-4ac9-928b-8ed0198ce4cf_2405_1.png' },
  { id: 15, name: 'Shampoo', category: 'Personal Care', originalPrice: '₹4999', price: '₹199', discount: '45% (120)', image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/hds/hds94959/y/24.jpg' },
];

  // Load cart items from AsyncStorage on component mount
  useEffect(() => {
    loadCartItems();
  }, []);

  // Use useFocusEffect to refresh cart items when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCartItems();
    }, [])
  );

  // Save cart items to AsyncStorage whenever cartItems changes
  useEffect(() => {
    saveCartItems();
  }, [cartItems]);

  const loadCartItems = async () => {
    try {
      const savedCartItems = await AsyncStorage.getItem('cartItems');
      if (savedCartItems !== null) {
        setCartItems(JSON.parse(savedCartItems));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const saveCartItems = async () => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      // If product already exists in cart, increase quantity
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // If product is new to cart, add it with quantity 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    // Alert.alert('Success', `${product.name} added to cart!`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity becomes 0, remove the item from cart
      removeFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
  };

  // Check if a product is in the cart
  const isProductInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Get quantity of a product in cart
  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

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
      <Header
        title="Royal Kirana"
        showCart={true}
        cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
      />

      <ScrollView style={styles.content}>
        {/* Featured Categories with Sidebar Toggle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {/* <Text style={styles.sectionTitle}>Shop by Category</Text> */}
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
                >
                  <Image source={{ uri: category.image }} style={styles.categoryImage} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Popular Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Products</Text>
            {/* <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity> */}
          </View>

          <View style={styles.popularProductsContainer}>
            {popularProducts.map(product => {
              const inCart = isProductInCart(product.id);
              const quantity = getProductQuantity(product.id);

              return (
                <View key={product.id} style={styles.popularProductCard}>
                  <View style={styles.productBadge}>
                    <Text style={styles.productBadgeText}>Popular</Text>
                  </View>

                  <View style={styles.productCategoryContainer}>
                    <Text style={styles.productCategoryText}>{product.category}</Text>
                  </View>

                  <View style={styles.productImageContainer}>
                    <Image source={{ uri: product.image }} style={styles.popularProductImage} />
                  </View>

                  <Text style={styles.popularProductName}>{product.name}</Text>

                  {product.originalPrice ? (
                    <View style={styles.priceContainer}>
                      <Text style={styles.originalPrice}>{product.originalPrice}</Text>
                      <Text style={styles.discountedPrice}>{product.price}</Text>
                    </View>
                  ) : (
                    <Text style={styles.productPrice}>{product.price}</Text>
                  )}

                  {product.discount ? (
                    <Text style={styles.discountText}>{product.discount}</Text>
                  ) : null}

                  {inCart ? (
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Ionicons name="remove" size={16} color="#374151" />
                      </TouchableOpacity>

                      <Text style={styles.quantityText}>{quantity}</Text>

                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Ionicons name="add" size={16} color="#374151" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addToCartButton}
                      onPress={() => addToCart(product)}
                    >
                      <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        {/* <Footer /> */}
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
    padding: 10,
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
    marginTop: 0,
    marginBottom: 0,
  },
  slider: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCard: {
    width: '100%',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: 170,
    borderRadius: 8,
    marginBottom: 8,
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
    marginTop: 12,
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
  popularProductsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularProductCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
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
    position: 'relative',
  },
  productBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productCategoryContainer: {
    marginTop: 20,
    marginBottom: 5,
  },
  productCategoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  productImageContainer: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  popularProductImage: {
    width: '80%',
    height: '100%',
    resizeMode: 'contain',
  },
  popularProductName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 5,
  },
  discountText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    // width: '100%',
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
    width: '100%',
    justifyContent: 'center',
  },
  quantityButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
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