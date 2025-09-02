import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, Alert } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Load cart items from AsyncStorage on component mount and when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartItems();
    });

    // Load cart items initially
    loadCartItems();

    return unsubscribe;
  }, [navigation]);

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
      Alert.alert('Error', 'Failed to load cart items');
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving cart items:', error);
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const removeItem = async (id) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: async () => {
            const updatedItems = cartItems.filter(item => item.id !== id);
            setCartItems(updatedItems);

            // Save to AsyncStorage
            try {
              await AsyncStorage.setItem('cartItems', JSON.stringify(updatedItems));
            } catch (error) {
              console.error('Error saving cart items:', error);
              Alert.alert('Error', 'Failed to remove item');
            }
          }
        }
      ]
    );
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(10);
      Alert.alert('Success', 'Coupon applied! 10% discount added.');
    } else {
      Alert.alert('Error', 'Invalid coupon code');
    }
  };

  const parsePrice = (priceString) => {
    if (typeof priceString !== 'string') return 0;
    const numericString = priceString.replace('₹', '').replace(/,/g, '');
    const price = parseInt(numericString, 10);
    return isNaN(price) ? 0 : price;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parsePrice(item.price);
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const generateOrderId = () => {
    return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
  };

  const proceedToCheckout = async () => {
    const subtotal = calculateSubtotal();
    const total = calculateTotal();
    const discountAmount = (subtotal * discount) / 100;

    const order = {
      id: generateOrderId(),
      date: Date.now(),
      items: cartItems,
      subtotal,
      discount: discountAmount,
      deliveryFee: 40,
      total: total + 40,
      status: 'Processing'
    };

    // Save order to history
    try {
      const existingOrders = await AsyncStorage.getItem('orderHistory');
      let orders = [];

      if (existingOrders !== null) {
        orders = JSON.parse(existingOrders);
      }

      orders.unshift(order); // Add new order at the beginning
      await AsyncStorage.setItem('orderHistory', JSON.stringify(orders));

      // Clear cart
      await AsyncStorage.removeItem('cartItems');
      setCartItems([]);

      // Navigate to order confirmation
      navigation.navigate('OrderHistory');
      Alert.alert('Success', 'Your order has been placed successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const subtotal = calculateSubtotal();
  const total = calculateTotal();
  const discountAmount = (subtotal * discount) / 100;

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Shopping Cart" showBackButton={true} onBackPress={() => navigation.goBack()} />

        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some items to get started</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>

        {/* <Footer /> */}
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <Header title="Shopping Cart" showBackButton={true} onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.cartItemsContainer}>
          {cartItems.map(item => {
            const price = parsePrice(item.price);
            const quantity = item.quantity || 1;
            return (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price || '₹0'}</Text>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color="#374151" />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{quantity}</Text>

                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color="#374151" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemTotalContainer}>
                  <Text style={styles.itemTotal}>₹{price * quantity}</Text>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Coupon Section */}
        {/* <View style={styles.couponSection}>
          <Text style={styles.sectionTitle}>Apply Coupon</Text>
          <View style={styles.couponInputContainer}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <TouchableOpacity style={styles.applyButton} onPress={applyCoupon}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount ({discount}%)</Text>
              <Text style={[styles.summaryValue, styles.discountText]}>-₹{discountAmount}</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹40</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total + 40}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={proceedToCheckout}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        {/* Continue Shopping */}
        <TouchableOpacity 
          style={styles.continueShoppingButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  cartItemsContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
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
  itemTotalContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  removeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  couponSection: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: 'rgb(255, 107, 107)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  discountText: {
    color: '#ef4444',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  checkoutButton: {
    backgroundColor: 'rgb(255, 107, 107)',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueShoppingButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueShoppingText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;
