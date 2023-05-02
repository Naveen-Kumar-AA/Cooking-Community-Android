import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Comment from '../components/Comment';

const Comments = ({ route }) => {
  const { postId } = route.params;
  const [currentUsername, setCurrentUsername] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        const token = await AsyncStorage.getItem('token');
    
        const response = await fetch(`https://cooking-community-server.onrender.com/comments/${postId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log(data);
        setComments(data.result);
      } catch (error) {
        setErrorMessage(error);
      }
    };
    

    fetchCommentData();
  }, [commentText]);

  const handleCommentButton = async () => {
    if(commentText){

    const token = await AsyncStorage.getItem('token');
    
    const req_body = {
      postID: postId,
      userID: currentUsername,
      comment: commentText,
    };
    console.log(commentText);
    fetch('https://cooking-community-server.onrender.com/add-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(req_body),
    })
      .then(response => {console.log("HELLO");response.json()})
      .then(data => {
          console.log(data)
        setCommentText('');
      })
      .catch(error => {
        console.log(error);
      });}
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.commentsContainer}>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
            <Comment postID={postId} userID={item.userid} comment={item.comment} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.commentsContainer}
    />
    <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your comment here..."
          multiline={true}
          numberOfLines={3}
          underlineColorAndroid="transparent"
          onChangeText={(text)=>{setCommentText(text)}}
          value={commentText}
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
    backgroundColor: '#008080',
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  comment: {
    fontSize: 16,
  },
});

export default Comments;
