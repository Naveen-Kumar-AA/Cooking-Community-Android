import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Comment = ({ postID, userID, comment }) => {
  console.log(userID);

  const avatarBackgroundColors = [
    '#FF7F50', // Coral
    '#FFD700', // Gold
    '#00BFFF', // Deep Sky Blue
    '#6A5ACD', // Slate Blue
    '#8B008B', // Dark Magenta
    '#FF6347', // Tomato
    '#9370DB', // Medium Purple
    '#00CED1', // Dark Turquoise
    '#FFA07A', // Light Salmon
    '#FF00FF', // Magenta
    '#B22222', // Fire Brick
    '#FF1493', // Deep Pink
    '#7B68EE', // Medium Slate Blue
    '#228B22', // Forest Green
    '#4169E1', // Royal Blue
    '#DC143C', // Crimson
    '#9932CC', // Dark Orchid
    '#FF8C00', // Orange
    '#008080', // Teal
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
