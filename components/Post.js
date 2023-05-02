import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheet } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

const Post = ({ post_details }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(parseInt(post_details.likes));
  const [currentUsername, setCurrentUsername] = useState("");
  const [serverLikeStatus, setServerLikeStatus] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [noOfComments, setNoOfComments] = useState(0);
  const [token,setToken] = useState("");
  const [isSaved, setIsSaved] = useState(false);
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

    fetch('https://cooking-community-server.onrender.com/update-like-status', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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
      const token = await AsyncStorage.getItem('token');
      setToken(token);
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

    fetch('https://cooking-community-server.onrender.com/is-liked', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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
        const response = await fetch(`https://cooking-community-server.onrender.com/comments/no-of-comments/${post_details.postID}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      } 
        );
        const data = await response.json();
        setNoOfComments(data.result[0].count);
      } catch (error) {
        console.error(error);
      }
    }
    
    fetchNoOfComments()
    const fetchIsSaved = async () => {
      try {
        const response = await fetch(`https://cooking-community-server.onrender.com/is-saved/${currentUsername}/${post_details.postID}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        setIsSaved(result.isSaved);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchIsSaved();
  
  }, [currentUsername, post_details.postID]);

  useEffect(() => {
    setIsLiked(serverLikeStatus);
  }, [serverLikeStatus, isSaved]);


  const avatarBackgroundColors = [
    '#FF7F50', // Coral
    '#FFD700', // Gold
    '#00BFFF', // Deep Sky Blue
    '#6A5ACD', // Slate Blue
    '#8B008B', // Dark Magenta
    '#FF6347', // Tomato
    '#9370DB', // Medium Purple
    '#00CED1', // Dark Turquoise
    '#FFA07A', // Light Salmon
    '#FF00FF', // Magenta
    '#B22222', // Fire Brick
    '#FF1493', // Deep Pink
    '#7B68EE', // Medium Slate Blue
    '#228B22', // Forest Green
    '#4169E1', // Royal Blue
    '#DC143C', // Crimson
    '#9932CC', // Dark Orchid
    '#FF8C00', // Orange
    '#008080', // Teal
  ];
  
  
  
  
  const renderAvatar = (username) => {
    const colorIndex = Math.floor(Math.random() * avatarBackgroundColors.length);
    const color = avatarBackgroundColors[colorIndex];
    return (
    <TouchableOpacity onPress={() => {
      if(username !== currentUsername){
        navigation.navigate("OtherProfile", {user : {username}})
      }
    }}>
      <View style={styles.userContainer}>
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.username}>{post_details.username}</Text>
      </View>
    </TouchableOpacity>
    );
  };
  

  const handleDeletePost = async ()=>{
    fetch(`https://cooking-community-server.onrender.com/delete-post/${post_details.postID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
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
    if(!isSaved) {
      fetch('https://cooking-community-server.onrender.com/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req_body)
      })
      .then(response => response.json())
      .then(data => {
        if(data.message) {
          // setIsMenuOpen(false);
          setIsSaved(!isSaved);
          console.log(data.message);
        }
      })
      .catch(error => {
        console.log(error);
      }); 
  }  
  else {
    fetch('https://cooking-community-server.onrender.com/unsave', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req_body)
    })
    .then(response => response.json())
    .then(data => {
      if(data.message) {
        // setIsMenuOpen(false);
        setIsSaved(!isSaved);
        console.log(data.message);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
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
        <View style={styles.row}>
  {currentUsername === post_details.username ? (
    <TouchableOpacity onPress={handleDeletePost} style={styles.bottomSheetItem}>
      <IconFontAwesome name="trash" size={35} color="#FF0000" style={styles.buttonIconFontAwesome} />
      <Text style={styles.buttonText}>Delete post</Text>
    </TouchableOpacity>
  ) : null}
  {currentUsername !== post_details.username ? (
        <TouchableOpacity onPress={handleSaveButton} style={styles.bottomSheetItem}>
          {isSaved ? (
            <IconFontAwesome name="bookmark" size={35} color="#fff" style={styles.buttonIconFontAwesome} />
          ) : (
            <Icon name="bookmark" size={35} color="#fff" style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>{isSaved ? 'Unsave post' : 'Save post'}</Text>
        </TouchableOpacity>
      ) : null}
  <TouchableOpacity onPress={() => setIsMenuOpen(false)} style={styles.bottomSheetItem}>
    <IconFontAwesome name="ban" size={35} color="#fff" style={styles.buttonIconFontAwesome} />
    <Text style={styles.buttonText}>Cancel</Text>
  </TouchableOpacity>
  </View>
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
    backgroundColor: '#008080',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '40%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetItem: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    paddingLeft: 10,
    textAlign: 'center',
  },
  buttonIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  
  
});

export default Post;
