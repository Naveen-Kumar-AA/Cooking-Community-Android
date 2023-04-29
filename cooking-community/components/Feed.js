import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import Post from './Post';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://192.168.29.210:3001/posts');
      const data = await response.json();
      setPosts([...data]); // create new array with updated data
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false); // set refreshing to false after fetch completes
    }
  };
  

  const renderItem = ({ item }) => {
    return (
      <Post post_details={item} />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.postID.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 16,
  },
});

export default Feed;
