import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Feed from '../components/Feed';
import Search from '../components/Search';
import Profile from '../components/Profile';
import NewPost from '../components/NewPost';


const Tab = createBottomTabNavigator();

const HomeTab = ({navigation}) => {
  return (
    <Tab.Navigator
    tabBarOptions={{
      activeTintColor: '#008080', // Set the active tab color to teal
    }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
            headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={() => <Search navigation={navigation} />}
        options={{
            headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="New Post"
        component={NewPost}
        options={{
            headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeTab;
