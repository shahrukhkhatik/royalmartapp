import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';

const CategoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: 1, name: 'Fruits & Vegetables', count: 45, image: 'https://placehold.co/300x200/4CAF50/white?text=Fruits+%26+Veg' },
    { id: 2, name: 'Dairy & Eggs', count: 32, image: 'https://placehold.co/300x200/2196F3/white?text=Dairy+%26+Eggs' },
    { id: 3, name: 'Meat & Seafood', count: 28, image: 'https://placehold.co/300x200/E74C3C/white?text=Meat+%26+Fish' },
    { id: 4, name: 'Bakery', count: 56, image: 'https://placehold.co/300x200/FF9800/white?text=Bakery' },
    { id: 5, name: 'Beverages', count: 67, image: 'https://placehold.co/300x200/9C27B0/white?text=Beverages' },
    { id: 6, name: 'Snacks', count: 89, image: 'https://placehold.co/300x200/FF5722/white?text=Snacks' },
    { id: 7, name: 'Frozen Foods', count: 42, image: 'https://placehold.co/300x200/00BCD4/white?text=Frozen+Foods' },
    { id: 8, name: 'Personal Care', count: 76, image: 'https://placehold.co/300x200/607D8B/white?text=Personal+Care' },
  ];

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="Categories" showBackButton={false} />
      
      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {filteredCategories.map(category => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Image source={{ uri: category.image }} style={styles.categoryImage} />
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} items</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <Footer />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesGrid: {
    padding: 16,
  },
  categoryCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  categoryInfo: {
    padding: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
});

export default CategoryScreen;