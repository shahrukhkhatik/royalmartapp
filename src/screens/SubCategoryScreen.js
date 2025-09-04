import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cartItems';

const SubCategoryScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;

  // State for subcategories and cart items
  const [subCategories, setSubCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Load subcategories based on categoryId
  useEffect(() => {
    const loadSubCategories = () => {
      // Complete subcategories data for all categories
      const subCategoriesData = {
        1: [
          { id: 101, name: 'Fresh Fruits', category: 'Fruits & Vegetables', originalPrice: '₹299', price: '₹199', discount: '33% OFF', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 102, name: 'Fresh Vegetables', category: 'Fruits & Vegetables', originalPrice: '₹149', price: '₹99', discount: '34% OFF', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 103, name: 'Organic Produce', category: 'Fruits & Vegetables', originalPrice: '₹249', price: '₹179', discount: '28% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb_eqxUwaOaKVUQlw-QEL5cUX5lonNwn6x5g&s' },
          { id: 104, name: 'Herbs & Seasonings', category: 'Fruits & Vegetables', originalPrice: '₹199', price: '₹129', discount: '35% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjsauGFwQ7TWeWz58lmZPrYjPDlgKCy2q4PA&s' },
          { id: 105, name: 'Exotic Fruits', category: 'Fruits & Vegetables', originalPrice: '₹399', price: '₹299', discount: '25% OFF', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 106, name: 'Leafy Greens', category: 'Fruits & Vegetables', originalPrice: '₹99', price: '₹69', discount: '30% OFF', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        ],
        2: [
          { id: 201, name: 'Milk', category: 'Dairy & Eggs', originalPrice: '₹79', price: '₹59', discount: '25% OFF', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 202, name: 'Cheese', category: 'Dairy & Eggs', originalPrice: '₹249', price: '₹199', discount: '20% OFF', image: 'https://5.imimg.com/data5/PR/MR/GY/SELLER-5113762/yellow-cheddar-cheese.jpg' },
          { id: 203, name: 'Yogurt', category: 'Dairy & Eggs', originalPrice: '₹119', price: '₹89', discount: '25% OFF', image: 'https://images-cdn.ubuy.co.in/647bdf2cf65c567240710394-chobani-non-fat-greek-yogurt.jpg' },
          { id: 204, name: 'Butter', category: 'Dairy & Eggs', originalPrice: '₹139', price: '₹109', discount: '22% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_x2fuQSkqX_-o6VktsZfOuhHBpsLuEFsCQQ&s' },
          { id: 205, name: 'Eggs', category: 'Dairy & Eggs', originalPrice: '₹79', price: '₹59', discount: '25% OFF', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 206, name: 'Cow Milk', category: 'Dairy & Eggs', originalPrice: '₹89', price: '₹69', discount: '22% OFF', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        ],
        3: [
          { id: 301, name: 'Fresh Chicken', category: 'Meat & Seafood', originalPrice: '₹299', price: '₹249', discount: '17% OFF', image: 'https://www.shutterstock.com/shutterstock/videos/3687266627/thumb/8.jpg?ip=x480' },
          { id: 302, name: 'Poultry Chicken', category: 'Meat & Seafood', originalPrice: '₹349', price: '₹279', discount: '20% OFF', image: 'https://www.chikplaza.com/wp-content/uploads/2017/08/Chicken-Whole-Boiler-Full_STP3512.jpg' },
          { id: 303, name: 'Seafood', category: 'Meat & Seafood', originalPrice: '₹499', price: '₹399', discount: '20% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgIJNJoZAbCTuSpKgvAixO-8wlyOQM7HhE7A&s' },
          { id: 304, name: 'Processed Meat', category: 'Meat & Seafood', originalPrice: '₹199', price: '₹159', discount: '20% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_TXvdOF8yMPC9ExggmauVSElL7Jxfme1tYw&s' },
          { id: 305, name: 'Frozen Meat', category: 'Meat & Seafood', originalPrice: '₹299', price: '₹239', discount: '20% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAD1wHnAxWgOkN51LWj2_MfUyr-Re3j61Hdw&s' },
          { id: 306, name: 'Organic Meat', category: 'Meat & Seafood', originalPrice: '₹399', price: '₹349', discount: '13% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW9vvosHyZYD8gHwLBLlS_n41GOqSj_fas-A&s' },
        ],
        4: [
          { id: 401, name: 'Fresh Bread', category: 'Bakery', originalPrice: '₹49', price: '₹39', discount: '20% OFF', image: 'https://www.rockrecipes.com/wp-content/uploads/2008/01/DSC_0221-4.jpg' },
          { id: 402, name: 'Pastries', category: 'Bakery', originalPrice: '₹99', price: '₹79', discount: '20% OFF', image: 'https://theobroma.in/cdn/shop/files/EgglessDutchTrufflePastry.jpg?v=1711099798' },
          { id: 403, name: 'Cakes', category: 'Bakery', originalPrice: '₹399', price: '₹299', discount: '25% OFF', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 404, name: 'Cookies', category: 'Bakery', originalPrice: '₹149', price: '₹109', discount: '27% OFF', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 405, name: 'Donuts', category: 'Bakery', originalPrice: '₹79', price: '₹59', discount: '25% OFF', image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 406, name: 'Artisan Bread', category: 'Bakery', originalPrice: '₹99', price: '₹79', discount: '20% OFF', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
        ],
        5: [
          { id: 501, name: 'Soft Drinks', category: 'Drinks', originalPrice: '₹79', price: '₹59', discount: '25% OFF', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 502, name: 'Fruit Juices', category: 'Drinks', originalPrice: '₹99', price: '₹79', discount: '20% OFF', image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2025/5/16/3b819446-a93b-4839-89c4-8f75bdb0dcc0_344_1.png' },
          { id: 503, name: 'Energy Drinks', category: 'Drinks', originalPrice: '₹149', price: '₹119', discount: '20% OFF', image: 'https://tiimg.tistatic.com/fp/1/008/585/energy-drink-250-ml-368.jpg' },
          { id: 504, name: 'Coffee', category: 'Drinks', originalPrice: '₹199', price: '₹149', discount: '25% OFF', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 505, name: 'Tea', category: 'Drinks', originalPrice: '₹129', price: '₹99', discount: '23% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIKW0hDZrL0AuTFpzcoqY7tRzxlIgwb5tbpw&s' },
          { id: 506, name: 'Mocktails', category: 'Drinks', originalPrice: '₹199', price: '₹159', discount: '20% OFF', image: 'https://savortheflavour.com/wp-content/uploads/2020/07/Blue-Lagoon-Mocktail-Tasty.jpg' },
        ],
        6: [
          { id: 601, name: 'Chips', category: 'Snacks', originalPrice: '₹49', price: '₹39', discount: '20% OFF', image: 'https://images-cdn.ubuy.co.in/679419253b48a803c65f7223-lays-classic-potato-chips-15-25-oz-bag.jpg' },
          { id: 602, name: 'Namkeen', category: 'Snacks', originalPrice: '₹79', price: '₹59', discount: '25% OFF', image: 'https://www.haldiramuk.com/cdn/shop/files/0000s_0002_fop-220g_5c0428c5-d9bb-449b-b13b-3977a2a3cab4.png?v=1718874410' },
          { id: 603, name: 'Biscuits', category: 'Snacks', originalPrice: '₹69', price: '₹49', discount: '28% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxjbswF9S7GNiJjDCDNZiVJ98LTZOdiK-4YA&s' },
          { id: 604, name: 'Chocolates', category: 'Snacks', originalPrice: '₹129', price: '₹99', discount: '23% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTygWTv4FQoBtH3KLTcy4H2RA44ZA0vbvQOBw&s' },
          { id: 605, name: 'Popcorn', category: 'Snacks', originalPrice: '₹99', price: '₹79', discount: '20% OFF', image: 'https://i0.wp.com/spainonafork.com/wp-content/uploads/2019/04/popcornHOR-11.png?fit=750%2C750&ssl=1' },
          { id: 606, name: 'Mixture', category: 'Snacks', originalPrice: '₹89', price: '₹69', discount: '22% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNa785C6dKieh_-f5FbYSYAN_vDMVcXjZabQ&s' },
        ],
        7: [
          { id: 701, name: 'Frozen', category: 'Frozen Foods', originalPrice: '₹149', price: '₹119', discount: '20% OFF', image: 'https://www.foodrepublic.com/img/gallery/the-worlds-first-frozen-foods-date-back-thousands-of-years/intro-1684964181.jpg' },
          { id: 702, name: 'Frozen Meat', category: 'Frozen Foods', originalPrice: '₹399', price: '₹319', discount: '20% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyOW19VHWyeWCuCbizPWR0bszBKyISEX5Iow&s' },
          { id: 703, name: 'Ice Creams', category: 'Frozen Foods', originalPrice: '₹249', price: '₹199', discount: '20% OFF', image: 'https://www.allrecipes.com/thmb/SI6dn__pfJb9G5eBpYAqkyGCLxQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/50050-five-minute-ice-cream-DDMFS-4x3-076-fbf49ca6248e4dceb3f43a4f02823dd9.jpg' },
          { id: 704, name: 'Frozen Snacks', category: 'Frozen Foods', originalPrice: '₹299', price: '₹229', discount: '23% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvzsW0VTtEZnX7zhAYBdZUrQgARnwvGeR_Cg&s' },
          { id: 705, name: 'Frozen Desserts', category: 'Frozen Foods', originalPrice: '₹349', price: '₹269', discount: '23% OFF', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
          { id: 706, name: 'Frozen Ready Meals', category: 'Frozen Foods', originalPrice: '₹399', price: '₹319', discount: '20% OFF', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfHWAod7yXIYYWzS6AlmtLSHLtNvfRI_zIig&s' },
        ],
      }


      setSubCategories(subCategoriesData[categoryId] || []);
    };

    loadSubCategories();
  }, [categoryId]);

  // Load cart items from AsyncStorage on mount
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedItems !== null) {
          setCartItems(JSON.parse(savedItems));
        }
      } catch (error) {
        console.error('Failed to load cart items from AsyncStorage', error);
      }
    };
    loadCartItems();
  }, []);

  // Save cart items to AsyncStorage whenever cartItems change
  useEffect(() => {
    const saveCartItems = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart items to AsyncStorage', error);
      }
    };
    saveCartItems();
  }, [cartItems]);

  // Check if item is in cart
  const isItemInCart = (id) => {
    return cartItems.some(item => item.id === id);
  };

  // Get quantity of item in cart
  const getItemQuantity = (id) => {
    const item = cartItems.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  // Add item to cart or increment qty if already present
  const addToCart = (item) => {
    const existingItem = cartItems.find(i => i.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    // Alert.alert('Success', `${item.name} added to cart!`);
  };

  // Update quantity, remove if quantity <1
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
      setCartItems(cartItems.filter(i => i.id !== id));
    } else {
      setCartItems(cartItems.map(i =>
        i.id === id ? { ...i, quantity: newQty } : i
      ));
    }
  };

  return (
    <View style={styles.container}>
      <Header title={categoryName} showBackButton navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.subCategoriesGrid}>
          {subCategories.map(sub => {
            const inCart = isItemInCart(sub.id);
            const quantity = getItemQuantity(sub.id);

            return (
              <View key={sub.id} style={styles.subCategoryCard}>
                <Image source={{ uri: sub.image || '' }} style={styles.subCategoryImage} />
                <Text style={styles.subCategoryName}>{sub.name}</Text>
                <Text style={styles.priceText}>
                  <Text style={styles.originalPrice}>{sub.originalPrice} </Text>
                  <Text style={styles.discountedPrice}>{sub.price}</Text>
                </Text>
                <Text style={styles.discountText}>{sub.discount}</Text>

                {inCart ? (
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(sub.id, quantity - 1)}>
                      <Ionicons name="remove" size={16} color="#374151" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(sub.id, quantity + 1)}>
                      <Ionicons name="add" size={16} color="#374151" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(sub)}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  subCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  subCategoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  subCategoryImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  subCategoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    marginBottom: 2,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  discountText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '500',
    marginBottom: 6,
  },
  addToCartButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
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
    marginTop: 8,
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
});

export default SubCategoryScreen;
