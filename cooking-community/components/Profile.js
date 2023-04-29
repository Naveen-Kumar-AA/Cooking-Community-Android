import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import Post from '../components/Post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl } from 'react-native';


const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");
  const [noOfPosts, setNoOfPosts] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    console.log("Refreshing...");
    setRefreshing(true);
    const fetchUserData = async () => {
      // Fetch the user details
      try {
        const response = await fetch(`http://192.168.29.210:3001/Homepage/${currentUsername}`);
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error(error);
      }
  
      // Fetch the user posts
      try {
        const response = await fetch(`http://192.168.29.210:3001/get-user-posts/${currentUsername}`);
        const data = await response.json();
        setUserPosts(data);
        setNoOfPosts(data.length);
      } catch (error) {
        console.error(error);
      }
      setRefreshing(false);
    };
  
    fetchUserData();
  }, [currentUsername]);
  

  useEffect(()=>{
    const getCurrentUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        setCurrentUsername(username);
      } catch (error) {
        console.log(error);
      }
    };
    getCurrentUsername();
  },[])

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch the user details
      try {
        const response = await fetch(`http://192.168.29.210:3001/Homepage/${currentUsername}`);
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error(error);
      }
  
      // Fetch the user posts
      try {
        const response = await fetch(`http://192.168.29.210:3001/get-user-posts/${currentUsername}`);
        const data = await response.json();
        setUserPosts(data);
        setNoOfPosts(data.length); 
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUserData();
  }, [currentUsername,refreshing]);
  


  const renderPost = ({ item }) => {
    const postDetails = {
      postID: item.postID,
      title: item.title,
      meal: item.meal,
      cuisine: item.cuisine,
      recipe_content: item.recipe_content,
      caption: item.caption,
      username: item.username,
      date: item.date,
      likes: item.likes,
    };
  
    return (
      <Post 
        post_details={postDetails}
      />
    );
  };

  return (
    <ScrollView style={styles.container}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    >
      {userDetails ? (
        <>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userDetails.username.charAt(0).toUpperCase()}</Text>
              {/* <Text style={styles.avatarText}>{getUsernameInitials().toUpperCase()}</Text> */}
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.username}>{userDetails.username}</Text>
              <Text style={styles.name}>{userDetails.first_name} {userDetails.last_name}</Text>
              <View style={styles.followDetails}>
                <Text style={styles.followers}>{userDetails.no_of_followers} followers</Text>
                <Text style={styles.following}>{userDetails.no_of_following} following</Text>
                <Text style={styles.following}> </Text>
                <Text style={styles.noOfPosts}>{noOfPosts} posts</Text> 
              </View>
              <Text style={styles.bio}>{userDetails.bio}</Text>
            </View>
          </View>
          <View style={styles.gallery}>
            <Text style={styles.galleryTitle}>POSTS</Text>
            <FlatList
              data={userPosts}
              renderItem={renderPost}
              keyExtractor={(item) => item.postID}
              contentContainerStyle={styles.galleryList}
            />
          </View>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
}



const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
        },
        header: {
          flexDirection: 'row',
          padding: 16,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        },
        avatar: {
          backgroundColor: '#2196F3',
          width: 90,
          height: 90,
          borderRadius: 45,
          alignItems: 'center',
          justifyContent: 'center',
        },
        avatarText: {
          color: '#fff',
          fontSize: 40,
        },
        userDetails: {
          marginLeft: 16,
        },
        username: {
          fontWeight: 'bold',
          fontSize: 16,
          marginBottom: 4,
        },
        name: {
          fontSize: 14,
          color: '#666',
          marginBottom: 8,
        },
        followDetails: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        },
        followButton: {
          backgroundColor: '#2196F3',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 4,
          marginRight: 8,
        },
        followButtonText: {
          color: '#fff',
          fontWeight:"bold"
        },
        followers: {
          color: '#666',
          marginRight: 8,
        },
        following: {
          color: '#666',
        },
        bio: {
          fontSize: 14,
          color: '#555',
          marginTop: 8,
        },
        gallery: {
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        },
        galleryTitle: {
          fontWeight: 'bold',
          fontSize: 16,
          marginBottom: 8,
        },
        galleryList: {
          marginTop: 8,
        },
        post: {
          marginBottom: 16,
        },
        postImage: {
          width: '100%',
          height: undefined,
          aspectRatio: 1,
        },
        noOfPosts:{
            color: '#666',
        }
      });



export default Profile;