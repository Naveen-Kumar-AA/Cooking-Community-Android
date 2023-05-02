import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import Post from '../components/Post';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SavedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUsername, setCurrentUsername] = useState("");

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchPosts();
    }, []);
    
    useEffect(() => {
        const getCurrentUsername = async () => {
            try {
                const username = await AsyncStorage.getItem('username');
                setCurrentUsername(username);
            } catch (error) {
                console.log(error);
            }
        };
        getCurrentUsername();
    }, []);

    useEffect(()=>{
        fetchPosts();
    },[currentUsername]);
    
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
        const response = await fetch(`https://cooking-community-server.onrender.com/get-saved-posts/${currentUsername}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Add token to the header
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data);
        const data1 = data.resultArray;
        console.log(data1);
        setPosts([...data1]); // create new array with updated data
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
export default SavedPosts;
