import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Ionicons } from '@expo/vector-icons';

const SubCategoryScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  
  // Sample subcategories data - in a real app, this would come from an API
  const [subCategories, setSubCategories] = useState([]);
  
  useEffect(() => {
    // This would typically be an API call based on categoryId
    const loadSubCategories = () => {
      // Complete subcategories data for all categories
      const subCategoriesData = {
        1: [
          { id: 101, name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 102, name: 'Fresh Vegetables', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 103, name: 'Organic Produce', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb_eqxUwaOaKVUQlw-QEL5cUX5lonNwn6x5g&s' },
          { id: 104, name: 'Herbs & Seasonings', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjsauGFwQ7TWeWz58lmZPrYjPDlgKCy2q4PA&s' },
          { id: 105, name: 'Exotic Fruits', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 106, name: 'Leafy Greens', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
        ],
        2: [
          { id: 201, name: 'Milk', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 202, name: 'Cheese', image: 'https://5.imimg.com/data5/PR/MR/GY/SELLER-5113762/yellow-cheddar-cheese.jpg' },
          { id: 203, name: 'Yogurt', image: 'https://images-cdn.ubuy.co.in/647bdf2cf65c567240710394-chobani-non-fat-greek-yogurt.jpg' },
          { id: 204, name: 'Butter', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_x2fuQSkqX_-o6VktsZfOuhHBpsLuEFsCQQ&s' },
          { id: 205, name: 'Eggs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 206, name: 'Cow Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
        ],
        3: [
          { id: 301, name: 'Fresh Chicken', image: 'https://www.shutterstock.com/shutterstock/videos/3687266627/thumb/8.jpg?ip=x480' },
          { id: 302, name: 'Poultry Chicken', image: 'https://www.chikplaza.com/wp-content/uploads/2017/08/Chicken-Whole-Boiler-Full_STP3512.jpg' },
          { id: 303, name: 'Seafood', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgIJNJoZAbCTuSpKgvAixO-8wlyOQM7HhE7A&s' },
          { id: 304, name: 'Processed Meat', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_TXvdOF8yMPC9ExggmauVSElL7Jxfme1tYw&s' },
          { id: 305, name: 'Frozen Meat', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAD1wHnAxWgOkN51LWj2_MfUyr-Re3j61Hdw&s' },
          { id: 306, name: 'Organic Meat', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW9vvosHyZYD8gHwLBLlS_n41GOqSj_fas-A&s' },
        ],
        4: [
          { id: 401, name: 'Fresh Bread', image: 'https://www.rockrecipes.com/wp-content/uploads/2008/01/DSC_0221-4.jpg' },
          { id: 402, name: 'Pastries', image: 'https://theobroma.in/cdn/shop/files/EgglessDutchTrufflePastry.jpg?v=1711099798' },
          { id: 403, name: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 404, name: 'Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 405, name: 'Donuts', image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 406, name: 'Artisan Bread', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
        ],
        5: [
          { id: 501, name: 'Soft Drinks', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkucIa4njztXawODeNblFOA_7mUzWAb9oKww&s' },
          { id: 502, name: 'Juices', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 503, name: 'Tea & Coffee', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 504, name: 'Energy Drinks', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtrpGo2reuCtTNLjaMAb4bfgfV-smNMcKVA&s' },
          { id: 505, name: 'Bisleri Water', image: 'https://www.chennaigrocers.com/cdn/shop/files/BisleriWater1L_2.png?v=1737442885&width=1500' },
          { id: 506, name: 'Alcoholic Beverages', image: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
        ],
        6: [
          { id: 601, name: 'Chips & Crisps', image: 'https://www.quickpantry.in/cdn/shop/products/lay-s-chile-limon-potato-chips-32-g-quick-pantry.jpg?v=1710539171' },
          { id: 602, name: 'Nuts & Seeds', image: 'https://m.media-amazon.com/images/I/8116WQQe6bL._UF1000,1000_QL80_.jpg' },
          { id: 603, name: 'Chocolates', image: 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 604, name: 'Biscuits & Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 605, name: 'Trail Mix', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 606, name: 'Popcorn', image: 'https://popcornandcandyfloss.com/cdn/shop/files/Studio_Session-165-2_1.jpg?v=1693889593' },
        ],
        7: [
          { id: 701, name: 'Frozen Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 702, name: 'Frozen Fruits', image: 'https://d2j6dbq0eux0bg.cloudfront.net/images/9472145/1757184314.jpg' },
          { id: 703, name: 'Frozen Meals', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 704, name: 'Ice Cream', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToNb4qLVc8li_M2NHBfEl14DaVpUCmplY5lg&s' },
          { id: 705, name: 'Frozen Seafood', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
          { id: 706, name: 'Frozen Desserts', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
        ],
      };
      
      setSubCategories(subCategoriesData[categoryId] || []);
    };
    
    loadSubCategories();
  }, [categoryId]);

  return (
    <View style={styles.container}>
      <Header 
        title={categoryName} 
        showBackButton={true} 
        navigation={navigation}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subcategories Grid */}
        <View style={styles.subCategoriesGrid}>
          {subCategories.map(subCategory => (
            <TouchableOpacity key={subCategory.id} style={styles.subCategoryCard}>
              <Image source={{ uri: subCategory.image }} style={styles.subCategoryImage} />
              <Text style={styles.subCategoryName}>{subCategory.name}</Text>
            </TouchableOpacity>
          ))}
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
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  breadcrumbActive: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  breadcrumbArrow: {
    marginHorizontal: 8,
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
  },
});

export default SubCategoryScreen;