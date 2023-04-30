import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Search({navigation}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [token,setToken] = useState("");

  useEffect(()=>{
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
        setToken(token);
      } catch (error) {
        console.log(error);
      }
    };
    getToken();
  },[])


  const handleSearch = () => {
    fetch(`http://192.168.29.210:3001/search/${query}`,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => setResults(data))
      .catch((error) => console.error(error));
  };

  const handleClick = (user) => {
    navigation.navigate('OtherProfile', { user });
  };

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#d3d3d3',
        }}
      />
    );
  };

  
  const avatarBackgroundColors = [
    '#FF7F50', // Coral
    '#FFD700', // Gold
    '#00FF7F', // Spring Green
    '#00BFFF', // Deep Sky Blue
    '#6A5ACD', // Slate Blue
    '#FF69B4', // Hot Pink
    '#8B008B', // Dark Magenta
    '#FF6347', // Tomato
    '#9370DB', // Medium Purple
    '#00CED1', // Dark Turquoise
    '#FFA07A', // Light Salmon
    '#32CD32', // Lime Green
    '#FF00FF', // Magenta
    '#B22222', // Fire Brick
    '#FF1493', // Deep Pink
    '#7B68EE', // Medium Slate Blue
    '#228B22', // Forest Green
    '#4169E1', // Royal Blue
    '#DC143C', // Crimson
    '#9932CC' // Dark Orchid
  ];
  
  
  const renderAvatar = (username) => {
    const colorIndex = Math.floor(Math.random() * avatarBackgroundColors.length);
    const color = avatarBackgroundColors[colorIndex];
    return (
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
        </View>
    );
  };

  return (
    <View style={styles.parentContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <FontAwesome name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleClick(item)} style={styles.listItem}>
              {renderAvatar(item.username)}
              <Text style={styles.usernameText}>{item.username}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    searchContainer: {
      flex: 1,
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      borderRadius: 5,
      paddingLeft: 5,
      paddingRight: 5,
      marginBottom: 10,
    },
    searchInput: {
      flex: 1,
      height: 40,
    },
    searchButton: {
      padding: 10,
      backgroundColor: '#2196F3',
      borderRadius: 5,
      marginLeft: 5,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    avatarText: {
      color: '#fff',
      fontSize: 18,
    },
    usernameText: {
      fontSize: 18,
    },
  });
      
export default Search;
