import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    if (!username) {
      setErrorMessage('Please enter a username.');
      setIsLoading(false);
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a password.');
      setIsLoading(false);
      return;
    }
    try {
      const response = await Promise.race([
        fetch('https://cooking-community-server.onrender.com/check-user-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }),
        new Promise(resolve => setTimeout(() => resolve({ timeout: true }), 10000))
      ]);
      if (response.timeout) {
        setErrorMessage('An unexpected error occurred, please try again.');
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      console.log(data);
      if (data.result.msg) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('username', username);
        setUsername("");
        setPassword("");
        setErrorMessage("");
        setIsLoading(false);
        navigation.navigate('Home');
      } 
      if(!data.result.msg) {
        setErrorMessage('Enter a valid username and password.');
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred, please try again.');
      console.log(error);
      setIsLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cooking Community</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.errorText}>{errorMessage}</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
    color: '#008080',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
  },
  button: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#FF4136',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});



export default Login;
