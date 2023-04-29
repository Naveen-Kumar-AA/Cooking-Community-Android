import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import Post from '../components/Post';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtherProfile = ({ route }) => {
  const { user } = route.params;
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const [followerCount, setFollowerCount] = useState(false);

  
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

  useEffect(()=>{

        const fetchUserData = async () => {
          
              // Fetch the user details
              try {
                const response = await fetch(`http://192.168.29.210:3001/Homepage/${user.username}`);
                const data = await response.json();
                setUserDetails(data);
                setFollowerCount(data.no_of_followers);
              } catch (error) {
                console.error(error);
              }
              // Fetch the user posts
              try {
                const response = await fetch(`http://192.168.29.210:3001/get-user-posts/${user.username}`);
                const data = await response.json();
                setUserPosts(data);
              } catch (error) {
                console.error(error);
              }
        }
        
        fetchUserData();
  },[isFollowing,currentUsername])

  useEffect(()=>{
    const fetchIsFollowing = async () => {
      try {
        const response = await fetch(`http://192.168.29.210:3001/is-following`,{
          method : 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            followername: currentUsername
          }),
        });
        const data = await response.json();
        console.log(user.username);
        console.log(currentUsername);
        console.log(data);
        if(data.success.isfollowing){
          setIsFollowing(true);
        }
        else{
          setIsFollowing(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchIsFollowing();
  },[currentUsername])

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

  const getAvatarBackgroundColor = () => {
    const colors = [
      '#e57373',
      '#f06292',
      '#ba68c8',
      '#9575cd',
      '#7986cb',
      '#64b5f6',
      '#4fc3f7',
      '#4dd0e1',
      '#4db6ac',
      '#81c784',
      '#aed581',
      '#ff8a65',
      '#d4e157',
      '#ffdd77',
      '#ffb74d',
      '#a1887f',
      '#90a4ae',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const toggleFollowClick = () => {
    fetch("http://192.168.29.210:3001/toggle-follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        otherUsername: userDetails.username,
        username: currentUsername,
        isFollowing: !isFollowing
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("data from backend: ", data)
      if(data.success){
        console.log("inside if")
        setIsFollowing(!isFollowing); // Update the state with the response from the backend
        console.log(isFollowing);
      }
      else{
        console.log("Error following or unfollowing")
      }
    })
    .catch(error => {
      console.error(error);
    });
  };
  
  const getUsernameInitials = () => {
    if (!userDetails || !userDetails.first_name || !userDetails.last_name) {
      return '';
    }
    const firstInitial = userDetails.first_name.charAt(0);
    const lastInitial = userDetails.last_name.charAt(0);
    return firstInitial + lastInitial;
  };
  return (
    <ScrollView style={styles.container}>
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
              {currentUsername!=user.username?<TouchableOpacity style={styles.followButton} onPress={toggleFollowClick}>
                <Text style={styles.followButtonText}>{isFollowing ? "following" : "follow"}</Text>
              </TouchableOpacity>:<View></View>}

                <Text style={styles.followers}>{userDetails.no_of_followers} followers</Text>
                <Text style={styles.following}>{userDetails.no_of_following} following</Text>
              </View>
              <Text style={styles.bio}>{userDetails.bio}</Text>
            </View>
          </View>
          <View style={styles.gallery}>
            <Text style={styles.galleryTitle}>Photos</Text>
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
          color: '#777',
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
          color: '#777',
          marginRight: 8,
        },
        following: {
          color: '#777',
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
      });

      

export default OtherProfile;
