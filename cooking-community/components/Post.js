import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheet } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const Post = ({ post_details }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(parseInt(post_details.likes));
  const [currentUsername, setCurrentUsername] = useState("");
  const [serverLikeStatus, setServerLikeStatus] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [noOfComments, setNoOfComments] = useState(0);
  const navigation = useNavigation();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  const toggleLike = useCallback(() => {
    setIsLiked(prevIsLiked => !prevIsLiked);
    setLikesCount(prevLikesCount => prevLikesCount + (isLiked ? -1 : 1));

    // Update like status on the server
    const req_body = {
      postID: post_details.postID,
      userID: currentUsername,
      likeStatus: !isLiked
    };

    fetch('http://192.168.29.210:3001/update-like-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req_body)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        setServerLikeStatus(prevServerLikeStatus => !prevServerLikeStatus);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }, [currentUsername, isLiked, post_details.postID]);

  const getCurrentUsername = useCallback(async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      setCurrentUsername(username);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getCurrentUsername();
  }, [getCurrentUsername]);

  useEffect(() => {
    const req_body = {
      postID: post_details.postID,
      userID: currentUsername
    };

    fetch('http://192.168.29.210:3001/is-liked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req_body)
    })
    .then(response => response.json())
    .then(data => {
      if(data.status) {
        setServerLikeStatus(data);
      }
    })
    .catch(error => {
      console.log(error);
    });
    const fetchNoOfComments = async ()=>{
      try {
        const response = await fetch(`http://192.168.29.210:3001/comments/no-of-comments/${post_details.postID}`);
        const data = await response.json();
        setNoOfComments(data.result[0].count);
      } catch (error) {
        console.error(error);
      }
    }
    fetchNoOfComments()
  }, [currentUsername, post_details.postID]);

  useEffect(() => {
    setIsLiked(serverLikeStatus);
  }, [serverLikeStatus]);


  const avatarBackgroundColors = [
    '#FF7F50',
    '#FFD700',
    '#00FF7F',
    '#00BFFF',
    '#6A5ACD',
    '#FF69B4',
    '#8B008B',
    '#FF4500'
  ];
  
  
  const renderAvatar = (username) => {
    const colorIndex = Math.floor(Math.random() * avatarBackgroundColors.length);
    const color = avatarBackgroundColors[colorIndex];
    return (
      <View style={styles.userContainer}>
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.username}>{post_details.username}</Text>
      </View>
    );
  };
  

  const handleDeletePost = async ()=>{
    fetch(`http://192.168.29.210:3001/delete-post/${post_details.postID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      if(data.success){
        setIsMenuOpen(false);
        console.log(data.success);
      }
      if(data.error){
        console.log(data.error);
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  const handleCommentButton = () => {
    navigation.navigate('Comments', { postId: post_details.postID });
  }
  
  const handleSaveButton = () => {
    const req_body = {
      postID: post_details.postID,
      userID: currentUsername
    };

    fetch('http://192.168.29.210:3001/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req_body)
    })
    .then(response => response.json())
    .then(data => {
      if(data.message) {
        setIsMenuOpen(false);
        console.log(data.message);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {renderAvatar(post_details.username)}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={toggleExpand} activeOpacity={0.7}>
            <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMenuOpen(true)} activeOpacity={0.7}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.date}>{post_details.date}</Text>
      <Text style={styles.title}>{post_details.title}</Text>
      <Text style={styles.meal}>{post_details.meal}</Text>
      <Text style={styles.cuisine}>{post_details.cuisine}</Text>
      <Text style={styles.caption}>{post_details.caption}</Text>
      <View style={styles.likesContainer}>
  <TouchableOpacity onPress={toggleLike} activeOpacity={0.7}>
    <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? 'red' : 'black'} />
  </TouchableOpacity>
  <Text style={styles.likesCount}>{likesCount} likes</Text>
  <TouchableOpacity onPress={handleCommentButton} style={styles.commentButtonContainer}>
    <Icon name="message-circle" size={25} color="#555" />
  </TouchableOpacity>
  <Text style={styles.likesCount}>{noOfComments} comments</Text>
</View>

      {isExpanded && <Text style={styles.recipe_content}>{post_details.recipe_content}</Text>}
      <BottomSheet isVisible={isMenuOpen} containerStyle={styles.bottomSheet}>
      {currentUsername === post_details.username?
      <TouchableOpacity onPress={handleDeletePost} style={styles.bottomSheetItem}>
          <Text style={styles.buttonText}>Delete post</Text>
        </TouchableOpacity>:<View></View>}
        {currentUsername != post_details.username?
          <TouchableOpacity onPress={handleSaveButton} style={styles.bottomSheetItem}>
            <Text style={styles.buttonText}>Save post</Text>
          </TouchableOpacity>:<View></View>}
        <TouchableOpacity onPress={() => setIsMenuOpen(false)} style={styles.bottomSheetItem}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
  
  
  
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  meal: {
    fontSize: 18,
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 18,
    marginBottom: 8,
  },
  caption: {
    fontSize: 16,
    marginBottom: 8,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentButtonContainer: {
    marginLeft: 10,
  },
  likesCount: {
    fontSize: 16,
    marginLeft: 8,
  },
  date: {
    fontSize: 16,
  },
  recipe_content: {
    fontSize: 16,
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: '#d3d3d3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bottomSheet: {
    backgroundColor: 'rgba(80, 80, 80, 0.90)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '40%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomSheetItem: {
    paddingVertical: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  deleteButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    width: '100%',
    width: '100%',
  },
  cancelButton: {
    fontSize: 20,
    width: '100%',
    fontWeight: 'bold',
    color: '#fff',
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  
});

export default Post;
