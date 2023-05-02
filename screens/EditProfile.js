import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function EditProfile({route}) {
  const profile = route.params;
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [bio, setBio] = useState(profile.bio);
  const [email, setEmail] = useState(profile.email);
  const [phoneNumber, setPhoneNumber] = useState(profile.phn_number);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      const token = await AsyncStorage.getItem('token');
      const username = await AsyncStorage.getItem('username');
      setToken(token);
      setUsername(username);
    }
    fetchData();
  }, []);
  const handleUpdate = async () => {
    const req_body = {
      username,
      First_name: firstName,
      Last_name: lastName,
      bio,
      email,
      phn_number: phoneNumber,
      token
    };
    console.log(req_body);
    const response = await fetch('https://cooking-community-server.onrender.com/edit-profile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req_body), // convert the request body to a JSON string
    });
    // const data = await response.json();
    // console.log(data);
    // navigation.navigate('Home');
    const data = await response.text();
    console.log(data);
    const parsedData = JSON.parse(data);
    console.log(parsedData);
    navigation.navigate("Home");
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text style={styles.label}>Last Name</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text style={styles.label}>Bio</Text>
      <TextInput style={styles.input} value={bio} onChangeText={setBio} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'#008080'
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  }
  ,
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
