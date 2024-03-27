import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TimeAgo from './time';

const DataItem = ({ data, onPress }) => {
  const { urlToImage, title, description, source, publishedAt } = data;

  const handlePress = () => {
    onPress({ url: data.url, title: data.title });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: urlToImage || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
        <Text numberOfLines={2} style={styles.description}>{description}</Text>
        <View style={styles.sourceContainer}>
          <Text style={styles.source}>{source.name}</Text>
          <TimeAgo time={publishedAt} style={styles.time} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  source: {
    fontSize: 14,
    color: '#888',
    marginRight: 10,
  },
  time: {
    fontSize: 14,
    color: '#888',
  },
});

export default DataItem;
