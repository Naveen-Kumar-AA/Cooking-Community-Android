import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [First_name, setFirstName] = useState('');
  const [Last_name, setLastName] = useState('');
  const [phn_number, setPhnNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [C_password, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

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
    setLoading(true);
    setErrorMessage('');
  
    // Validate inputs
    if (!username || !First_name || !Last_name || !phn_number || !email || !password || !C_password) {
      setErrorMessage('All fields are required');
      setLoading(false);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
      return;
    }
    if (username !== username.toLowerCase()) {
      setErrorMessage('Username must be in all lowercase letters');
      setLoading(false);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
      return;
    }
    if (!/^\d{10}$/.test(phn_number)) {
      setErrorMessage('Phone number must be 10 digits long');
      setLoading(false);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
      return;
    }
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
      setErrorMessage('Email is not valid.(xxxx@xxx.com)');
      setLoading(false);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,}$/.test(password)) {
      setErrorMessage('Password must contain at least one uppercase letter, one lowercase letter, one numeric value, no special characters and minimum of 7 characters.');
      setLoading(false);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
      return;
    }
    if (password !== C_password) {
      setErrorMessage('Passwords do not match');
      setLoading(false);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
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
    setLoading(false);
    console.log(data);
    if (data) {
      if (data.token) {
        storeUsername(username);
        storeToken(data.token);
        setErrorMessage("");
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000);
        navigation.navigate('Home');
      } else {
        setErrorMessage(data);
        setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
      }
    } else {
      setErrorMessage("Unexpected error. Please try again later.");
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
    }
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
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
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
    backgroundColor: '#008080',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight:'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});


export default SignUp;
