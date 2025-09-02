import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, FlatList, Animated, Easing, Dimensions } from 'react-native';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [animatedValue] = useState(new Animated.Value(0));

  // Load order history from AsyncStorage
  useEffect(() => {
    loadOrderHistory();
  }, []);

  const animateIn = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const loadOrderHistory = async () => {
    try {
      const savedOrders = await AsyncStorage.getItem('orderHistory');
      if (savedOrders !== null) {
        setOrders(JSON.parse(savedOrders));
      } else {
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    } finally {
      setLoading(false);
      animateIn();
    }
  };

  const toggleOrder = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#10B981';
      case 'Processing': return '#F59E0B';
      case 'Cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return 'checkmark-circle';
      case 'Processing': return 'time';
      case 'Cancelled': return 'close-circle';
      default: return 'ellipse';
    }
  };

  const filterOrders = () => {
    if (activeFilter === 'all') return orders;
    return orders.filter(order => order.status === activeFilter);
  };

  const renderOrderItem = ({ item, index }) => {
    const isExpanded = expandedOrderId === item.id;
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });
    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    return (
      <Animated.View 
        style={[
          styles.orderCard,
          {
            opacity,
            transform: [{ translateY }],
          }
        ]}
      >
        <TouchableOpacity 
          onPress={() => toggleOrder(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order #{item.id.slice(-5).toUpperCase()}</Text>
              <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
                <Ionicons 
                  name={getStatusIcon(item.status)} 
                  size={14} 
                  color={getStatusColor(item.status)} 
                  style={styles.statusIcon}
                />
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#6B7280" 
              />
            </View>
          </View>

          <View style={styles.orderItemsPreview}>
            {item.items.slice(0, 3).map((product, index) => (
              <View key={index} style={styles.previewImageContainer}>
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.previewImage} 
                />
              </View>
            ))}
            {item.items.length > 3 && (
              <View style={styles.moreItems}>
                <Text style={styles.moreItemsText}>+{item.items.length - 3}</Text>
              </View>
            )}
          </View>

          <View style={styles.orderFooter}>
            <Text style={styles.itemsCount}>{item.items.length} item{item.items.length !== 1 ? 's' : ''}</Text>
            <Text style={styles.orderTotal}>₹{(item.total ?? 0).toLocaleString('en-IN')}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.itemsTitle}>Items in this order</Text>
            {item.items.map((product, index) => (
              <View key={index} style={styles.productItem}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>₹{(product.price ?? 0).toLocaleString('en-IN')}</Text>
                    <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}
            
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{(item.subtotal ?? 0).toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>₹{(item.shipping ?? 0).toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>₹{(item.tax ?? 0).toLocaleString('en-IN')}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{(item.total ?? 0).toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.reorderButton]}>
                <Ionicons name="cart" size={16} color="#FFFFFF" />
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.detailsButton]}>
                <Ionicons name="document-text" size={16} color="#3B82F6" />
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="My Orders" showBackButton={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.centerContent}>
          <View style={styles.loadingAnimation}>
            <Ionicons name="receipt" size={48} color="#3B82F6" />
          </View>
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="My Orders" showBackButton={true} onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={80} color="#E5E7EB" />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>Your order history will appear here once you make a purchase</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Orders" showBackButton={true} onBackPress={() => navigation.goBack()} />
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'Delivered' && styles.activeFilter]}
          onPress={() => setActiveFilter('Delivered')}
        >
          <Text style={[styles.filterText, activeFilter === 'Delivered' && styles.activeFilterText]}>Delivered</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'Processing' && styles.activeFilter]}
          onPress={() => setActiveFilter('Processing')}
        >
          <Text style={[styles.filterText, activeFilter === 'Processing' && styles.activeFilterText]}>Processing</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === 'Cancelled' && styles.activeFilter]}
          onPress={() => setActiveFilter('Cancelled')}
        >
          <Text style={[styles.filterText, activeFilter === 'Cancelled' && styles.activeFilterText]}>Cancelled</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filterOrders()}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 10,
    gap: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilter: {
    backgroundColor: 'rgb(255, 107, 107)',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItemsPreview: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  previewImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  moreItems: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  itemsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  expandedContent: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  productQuantity: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  orderSummary: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  reorderButton: {
    backgroundColor: 'rgb(255, 107, 107)',
  },
  detailsButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  reorderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 100,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  continueShoppingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingAnimation: {
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 50,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default OrderHistoryScreen;
