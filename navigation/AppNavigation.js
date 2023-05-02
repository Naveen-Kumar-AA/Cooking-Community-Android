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
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#FF8C00',
          },
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

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerTitle: 'Sign Up',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#FF8C00',
          },
        }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerTitle: 'Home',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#FF8C00',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => { logout(); }} style={styles.logoutButton}>
              <Icon name="sign-out" size={32} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="OtherProfile"
        component={OtherProfile}
        options={{
          headerTitle: 'Other Profile',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#FF8C00',
          },
        }}
      />

      <Stack.Screen
        name="Comments"
        component={Comments}
        options={{
          headerTitle: 'Comments',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#FF8C00',
          },
        }}
      />

      <Stack.Screen
        name="SavedPosts"
        component={SavedPosts}
        options={{
          headerTitle: 'Saved Posts',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#FF8C00',
          },
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: 'Edit Profile',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#FF8C00',
          },
        }}
      />
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutButton:{ 
    paddingLeft:10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: '#008080',
  },
  headerTintColor: '#fff',
});


export default AppNavigation;
