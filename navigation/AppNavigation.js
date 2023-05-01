import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import OtherProfile from '../screens/OtherProfile';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Comments from '../screens/Comments';
import SavedPosts from '../screens/SavedPosts';
import EditProfile from '../screens/EditProfile';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

const AppNavigation = () => {
  const navigation = useNavigation();
  
  const logout = async () => {
    try {
      // Remove the token from AsyncStorage
      await AsyncStorage.removeItem('token');
      // Redirect the user to the login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={({ navigation }) => ({
          headerTitle: 'Login',
          headerRight: () => (
            <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('SignUp')}
>
  <Text style={styles.buttonText}>Sign Up</Text>
</TouchableOpacity>

          ),
        })}
      />
      <Stack.Screen name="SignUp" component={SignUp} />
      
      <Stack.Screen 
      name="Home" 
      component={Home} 
      options={({ navigation }) => ({
        headerTitle: 'Home',
        headerLeft: () => (
            <TouchableOpacity onPress={()=>{logout();}} style={styles.logoutButton}>
      <Icon name="sign-out" size={32} color="#555" />
    </TouchableOpacity>
        ),
      })}
      />
      
      <Stack.Screen name="OtherProfile" component={OtherProfile} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="SavedPosts" component={SavedPosts} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'black',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutButton:{ 
    paddingLeft:10,
  }
  
});

export default AppNavigation;
