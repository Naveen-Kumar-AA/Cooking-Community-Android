import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Text, ScrollView } from 'react-native';
import Post from './Post';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [mealFilter, setMealFilter] = useState('');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setMealFilter('');
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [mealFilter]);

  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
      const response = await fetch(`https://cooking-community-server.onrender.com/posts/${mealFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setPosts([...data]); // create new array with updated data
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false); // set refreshing to false after fetch completes
    }
  };

  const filterByMeal = (meal) => {
    setMealFilter(meal);
  };
  
  const renderItem = ({ item }) => {
    return (
      <Post post_details={item} />
    );
  };


  return (
    <View style={styles.container}>
      <View >
      <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterScrollViewContent}
      style={styles.filterScrollView}
    >
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => filterByMeal('')}>
          <Text style={mealFilter === '' ? styles.activeFilterText : styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByMeal('breakfast')}>
          <Text style={mealFilter === 'breakfast' ? styles.activeFilterText : styles.filterText}>Breakfast</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByMeal('lunch')}>
          <Text style={mealFilter === 'lunch' ? styles.activeFilterText : styles.filterText}>Lunch</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByMeal('snacks')}>
          <Text style={mealFilter === 'snacks' ? styles.activeFilterText : styles.filterText}>Snacks</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByMeal('dessert')}>
          <Text style={mealFilter === 'dessert' ? styles.activeFilterText : styles.filterText}>Dessert</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByMeal('dinner')}>
          <Text style={mealFilter === 'dinner' ? styles.activeFilterText : styles.filterText}>Dinner</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByMeal('drinks')}>
          <Text style={mealFilter === 'drinks' ? styles.activeFilterText : styles.filterText}>Drinks</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
      <FlatList 
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.postID.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterScrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterScrollView: {
    flexShrink: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#777',
  },
  activeFilterText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#008080',
  },

  postList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postListContent: {
    paddingBottom: 50,
  },
});


export default Feed;
