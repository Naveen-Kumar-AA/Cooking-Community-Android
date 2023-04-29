import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [meal, setMeal] = useState('Breakfast');
  const [cuisine, setCuisine] = useState('');
  const [caption, setCaption] = useState('');
  const [recipeContent, setRecipeContent] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');


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


  const handleSubmit = () => {
    const postBody = {
      username: currentUsername,
      title,
      meal,
      cuisine,
      caption,
      recipe: recipeContent
    };
    console.log(postBody);
    fetch('http://192.168.29.210:3001/new-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // reset state values here
        setTitle('');
        setMeal('Breakfast');
        setCuisine('');
        setCaption('');
        setRecipeContent('');
      })
      .catch(error => {
        console.error(error);
      });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the title of your recipe"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Meal:</Text>
      <Picker
        style={styles.input}
        selectedValue={meal}
        onValueChange={(itemValue) => setMeal(itemValue)}>
        <Picker.Item label="Breakfast" value="Breakfast" />
        <Picker.Item label="Lunch" value="Lunch" />
        <Picker.Item label="Dinner" value="Dinner" />
        <Picker.Item label="Snacks" value="Snacks" />
        <Picker.Item label="Dessert" value="Dessert" />
        <Picker.Item label="Drinks" value="Drinks" />
      </Picker>

      <Text style={styles.label}>Cuisine:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the cuisine of your recipe"
        value={cuisine}
        onChangeText={setCuisine}
      />

      <Text style={styles.label}>Caption:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a caption for your recipe"
        value={caption}
        onChangeText={setCaption}
      />

      <Text style={styles.label}>Recipe Content:</Text>
      <TextInput
        style={[styles.input, styles.recipeContent]}
        placeholder="Enter the content of your recipe"
        value={recipeContent}
        onChangeText={setRecipeContent}
        multiline
        numberOfLines={4}
      />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    marginTop: 5,
  },
  recipeContent: {
    height: 120,
    textAlignVertical: 'top',
  },
});

export default NewPost;
