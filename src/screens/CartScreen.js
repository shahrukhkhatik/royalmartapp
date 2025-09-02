import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // User details state for form
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [plot, setPlot] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartItems();
    });
    loadCartItems();
    // Load user data (name, mobile) from AsyncStorage
    loadUserData();
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.name) setFullName(user.name);
        if (user.mobileNumber) setMobileNumber(user.mobileNumber);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

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
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: async () => {
            const updatedItems = cartItems.filter(item => item.id !== id);
            setCartItems(updatedItems);
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

  // Validate form
  const validateDetailsForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }
    if (!mobileNumber.trim() || !/^\d{10}$/.test(mobileNumber)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!plot.trim()) {
      Alert.alert('Validation Error', 'Plot / House number is required');
      return false;
    }
    if (!street.trim()) {
      Alert.alert('Validation Error', 'Street / Lane is required');
      return false;
    }
    if (!landmark.trim()) {
      Alert.alert('Validation Error', 'Landmark is required');
      return false;
    }
    return true;
  };

  const onPressProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add some items to your cart before checkout');
      return;
    }
    setShowDetailsForm(true);
  };

  const submitOrder = async () => {
    if (!validateDetailsForm()) return;

    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    const total = calculateTotal();

    const order = {
      id: generateOrderId(),
      date: Date.now(),
      items: cartItems,
      subtotal,
      discount: discountAmount,
      deliveryFee: 40,
      total: total + 40,
      status: 'Processing',
      userDetails: {
        fullName,
        mobileNumber,
        email,
        address: {
          plot,
          street,
          landmark,
          area,
        }
      }
    };

    try {
      const existingOrders = await AsyncStorage.getItem('orderHistory');
      let orders = [];

      if (existingOrders !== null) {
        orders = JSON.parse(existingOrders);
      }

      orders.unshift(order); 
      await AsyncStorage.setItem('orderHistory', JSON.stringify(orders));

      await AsyncStorage.removeItem('cartItems');
      setCartItems([]);

      setShowDetailsForm(false);

      setFullName('');
      setMobileNumber('');
      setEmail('');
      setPlot('');
      setStreet('');
      setLandmark('');
      setArea('');

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
        <TouchableOpacity style={styles.checkoutButton} onPress={onPressProceedToCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.continueShoppingButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for user details form */}
      <Modal
        visible={showDetailsForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailsForm(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Your Details</Text>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Mobile */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit phone number"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Email (Optional) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email ID (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@mail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Plot / House Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Plot / House Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter plot/house no."
                  value={plot}
                  onChangeText={setPlot}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Street / Lane */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Street / Lane *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter street/lane"
                  value={street}
                  onChangeText={setStreet}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Landmark */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Landmark *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. near SBI ATM"
                  value={landmark}
                  onChangeText={setLandmark}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Area / Locality */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Area / Locality</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Locality/Area"
                  value={area}
                  onChangeText={setArea}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowDetailsForm(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={submitOrder}
                >
                  <Text style={styles.modalButtonText}>Place Order</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: '#374151', marginTop: 20, marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#6b7280', marginBottom: 30, textAlign: 'center' },
  cartItemsContainer: { padding: 16 },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  itemDetails: { flex: 1, justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#3b82f6', marginBottom: 8 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 8, padding: 4 },
  quantityButton: { padding: 8, borderRadius: 6, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  quantityText: { fontSize: 16, fontWeight: '600', color: '#374151', marginHorizontal: 16, minWidth: 20, textAlign: 'center' },
  itemTotalContainer: { alignItems: 'flex-end', justifyContent: 'space-between' },
  itemTotal: { fontSize: 18, fontWeight: 'bold', color: '#059669' },
  removeButton: { padding: 8, borderRadius: 6, backgroundColor: '#fef2f2' },
  summarySection: { backgroundColor: '#fff', padding: 20, margin: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 16, color: '#6b7280' },
  summaryValue: { fontSize: 16, fontWeight: '600', color: '#374151' },
  discountText: { color: '#ef4444' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 16, marginTop: 8 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#059669' },
  checkoutButton: { backgroundColor: 'rgb(255,107,107)', marginHorizontal: 16, marginBottom: 16, padding: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  continueShoppingButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgb(255, 107, 107)', marginHorizontal: 16, marginBottom: 24, padding: 16, borderRadius: 12, alignItems: 'center' },
  continueShoppingText: { color: 'rgb(255, 107, 107)', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', paddingHorizontal: 18 },
  modalContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 24, maxHeight: '85%', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#1f2937', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, fontSize: 16, color: '#111827', backgroundColor: '#f9fafb', elevation: 2 },
  modalButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  modalButton: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 6 },
  cancelButton: { backgroundColor: '#9ca3af' },
  submitButton: { backgroundColor: 'rgb(255,107,107)' },
  modalButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default CartScreen;
