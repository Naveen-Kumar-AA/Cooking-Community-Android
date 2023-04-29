import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import Post from '../components/Post';

const OtherProfile = ({ route }) => {
  const { user } = route.params;
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://192.168.29.210:3001/Homepage/${user.username}`);
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserPosts = async () => {
        try {
          const response = await fetch(`http://192.168.29.210:3001/get-user-posts/${user.username}`);
          const data = await response.json();
          setUserPosts(data);
          console.log("userposts: ");
          console.log(userPosts);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserDetails();
      fetchUserPosts();
  }, []);

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
    <ScrollView style={styles.container}>
      {userDetails ? (
        <>
          <View style={styles.header}>
            <Image style={styles.profilePicture} source={{ uri: userDetails.profile_picture }} />
            <View style={styles.userDetails}>
              <Text style={styles.username}>{userDetails.username}</Text>
              <Text style={styles.name}>{userDetails.first_name} {userDetails.last_name}</Text>
              <View style={styles.followDetails}>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userDetails: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
  },
  followDetails: {
    flexDirection: 'row',
    marginTop: 10,
  },
  followers: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  following: {
    fontWeight: 'bold',
  },
  bio: {
    marginTop: 10,
  },
  gallery: {
    marginTop: 20,
    paddingLeft: 20,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postContainer: {
    marginRight: 10,
  },
  postImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});
export default OtherProfile;
