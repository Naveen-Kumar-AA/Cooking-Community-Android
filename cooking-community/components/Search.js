import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


function Search({navigation}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  function randomHexColor() {
    // Generate a random color code in hexadecimal format
    const hexCode = Math.floor(Math.random() * 16777215).toString(16);
    // Pad the code with leading zeros to make sure it has 6 digits
    return "#" + "0".repeat(6 - hexCode.length) + hexCode;
  }

  const handleSearch = () => {
    fetch(`http://192.168.29.210:3001/search/${query}`)
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

  const renderAvatar = (username) => {
    const color = randomHexColor();
    return (
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>{username.charAt(0)}</Text>
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
