import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Comment from '../components/Comment';

const Comments = ({ route }) => {
  const { postId } = route.params;
  const [currentUsername, setCurrentUsername] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

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
    const fetchCommentData = async () => {
      // Fetch the user details
      try {
        const response = await fetch(`http://192.168.29.210:3001/comments/${postId}`);
        const data = await response.json();
        console.log(data);
        setComments(data.result);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchCommentData();
  }, [commentText]);

  const handleCommentButton = ()=>{
    const req_body = {
        postID : postId,
        userID : currentUsername,
        comment: commentText        
    }
    fetch('http://192.168.29.210:3001/comments  ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req_body)
      })
      .then(response => response.json())
      .then(data => {
        setCommentText("");
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.commentsContainer}>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
            <Comment postID={postId} userID={currentUsername} comment={item.comment} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.commentsContainer}
    />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your comment here..."
          multiline={true}
          numberOfLines={3}
          underlineColorAndroid="transparent"
          onChangeText={(text)=>{setCommentText(text)}}
        />
        <TouchableOpacity onPress={handleCommentButton} style={styles.postButton}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commentsContainer: {
    flex: 1,
    padding: 6,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    height: 80,
    flex: 1,
    marginRight: 16,
  },
  postButton: {
    backgroundColor: '#008cff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  comment: {
    fontSize: 16,
  },
});

export default Comments;
