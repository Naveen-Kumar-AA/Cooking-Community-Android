import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Comment = ({ postID, userID, comment }) => {
  const avatarBackgroundColors = [
    '#F94144',
    '#F3722C',
    '#F8961E',
    '#F9C74F',
    '#90BE6D',
    '#43AA8B',
    '#577590',
    '#264653'
  ];

  const getInitials = (name) => {
    const initials = name.match(/\b\w/g) || [];
    return (initials.shift() || '').toUpperCase() + (initials.pop() || '').toUpperCase();
  }

  const avatarBackgroundColor = avatarBackgroundColors[Math.floor(Math.random() * avatarBackgroundColors.length)];
  const initials = getInitials(userID);

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, {backgroundColor: avatarBackgroundColor}]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.username}>{userID}</Text>
        <Text style={styles.comment}>{comment}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  comment: {
    fontSize: 16,
  },
});

export default Comment;
