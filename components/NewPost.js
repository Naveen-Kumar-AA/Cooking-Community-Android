import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [meal, setMeal] = useState('Breakfast');
  const [cuisine, setCuisine] = useState('');
  const [caption, setCaption] = useState('');
  const [recipeContent, setRecipeContent] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(()=>{
    const getCurrentUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
        setToken(token);
        setCurrentUsername(username);
      } catch (error) {
        console.log(error);
      }
    };
    getCurrentUsername();
  },[])

  const alertContainerStyle = {
    position: 'absolute',
    bottom: 0,
    width: '75%',
    alignSelf: 'center',
  };

  const successAlertStyle = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  };
  
  
  const errorAlertStyle = {
    ...successAlertStyle,
    backgroundColor: '#F44336',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  };
  

  const handleSuccessAlertDismiss = () => {
    setShowSuccessAlert(false);
  };
  const handleErrorAlertDismiss = () => {
    setShowErrorAlert(false);
  };

  const handleSubmit =  () => {
    if (!title || !meal || !cuisine || !caption || !recipeContent) {
      let emptyField = '';
      if (!title) emptyField = 'Title';
      else if (!meal) emptyField = 'Meal';
      else if (!cuisine) emptyField = 'Cuisine';
      else if (!caption) emptyField = 'Caption';
      else if (!recipeContent) emptyField = 'Recipe';
  
      setErrorMessage(`${emptyField} cannot be empty`);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
      return;
    }
    const postBody = {
      username: currentUsername,
      title,
      meal,
      cuisine,
      caption,
      recipe: recipeContent
    };
    fetch('https://cooking-community-server.onrender.com/new-post', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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
        setErrorMessage('');
        // Alert.alert('Success', 'New post added successfully!', [{ text: 'OK' }]);
        setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);

      })
      .catch(error => {
        console.error(error);
        setErrorMessage(error.message);
      // Alert.alert('Error', error.message, [{ text: 'OK' }]);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
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
      <Button title="Submit" onPress={handleSubmit} color="#008080" />
      {showSuccessAlert && (
        <TouchableOpacity
          style={[successAlertStyle, alertContainerStyle]}
          onPress={handleSuccessAlertDismiss}>
          <Text style={{ color: '#fff' }}>New post created successfully!</Text>
        </TouchableOpacity>
      )}

      {/* error alert */}
      {showErrorAlert && (
        <TouchableOpacity
        style={[errorAlertStyle, alertContainerStyle]}
          onPress={handleErrorAlertDismiss}>
          <Text style={{ color: '#fff' }}>{errorMessage}</Text>
        </TouchableOpacity>
      )}

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
    color: '#008080'
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default NewPost;
