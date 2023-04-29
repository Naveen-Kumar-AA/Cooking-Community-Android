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

const Stack = createStackNavigator();

const AppNavigation = () => {
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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="OtherProfile" component={OtherProfile} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="SavedPosts" component={SavedPosts} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 5,

  },
  buttonText: {
    color: '#fff',
    fontWeight:'bold',
    fontSize: 14,
  },
});

export default AppNavigation;
