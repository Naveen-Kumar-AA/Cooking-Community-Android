import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const storeUsername = async (username) => {
    try {
      await AsyncStorage.setItem('username', username);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.29.210:3001/check-user-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      console.log(data[0]);
      if (data[0]) {
        storeUsername(username);
        navigation.navigate('Home');
      } else {
        setErrorMessage('Enter a valid username and password!!!\nPassword must consist of 1 lower case, 1 upper case, 1 numeric, 1 special character, and length should be within 5-30.');
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

Login.navigationOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.headerButton}>Signup</Text>
      </TouchableOpacity>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerButton: {
    marginRight: 15,
    color: '#0066cc',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Login;
