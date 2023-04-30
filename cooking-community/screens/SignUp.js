import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [First_name, setFirstName] = useState('');
  const [Last_name, setLastName] = useState('');
  const [phn_number, setPhnNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [C_password, setConfirmPassword] = useState('');

  const storeUsername = async (username) => {
    try {
      await AsyncStorage.setItem('username', username);
    } catch (error) {
      console.log(error);
    }
  }
const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.log(error);
  }
}

const handleSignUp = async () => {
  // Check if password and confirm password match
  if (password !== C_password) {
    console.log('Passwords do not match');
    return;
  }

  // Send sign up request to server
  const response = await fetch('https://cooking-community-server.onrender.com/do-signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      First_name,
      Last_name,
      phn_number,
      email,
      password,
      C_password
    }),
  })
  const data = await response.json();
  console.log(data);
  if(data){
    if (data.token) {
          storeUsername(username);
          storeToken(data.token);
          navigation.navigate('Home');
        } else {
          console.log('Cannot create account');
        }
  }
  else{
    console.log(data);
  }
  // .then(response => {
  //   console.log(response);
  //   response.json()
  // })
  // .then(data => {
  //   console.log(data);
  //   if (data.token) {
  //     storeUsername(username);
  //     storeToken(data.token);
  //     navigation.navigate('Home');
  //   } else {
  //     console.log('Cannot create account');
  //   }
  // })
  // .catch(error => {
  //   console.log(error);
  // });
};

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={First_name}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={Last_name}
        onChangeText={setLastName}
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phn_number}
        onChangeText={setPhnNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        value={C_password}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    width: '50%',
    height: 40,
    backgroundColor: '#0066cc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight:'bold',
  },
});


export default SignUp;
