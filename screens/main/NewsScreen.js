import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { getArticles } from '../../screens/service/news';
import DataItem from '../../components/DataItem';
import Modal from '../../components/Modal';

const NewsScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalArticleData, setModalArticleData] = useState({});

  const handleItemDataOnPress = (articleData) => {
    setModalVisible(true);
    setModalArticleData(articleData);
  }

  const handleModalClose = () => {
    setModalVisible(false);
    setModalArticleData({});
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesData = await getArticles();
        setIsLoading(false);
        setData(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setIsLoading(false);
        // Handle error display
      }
    };

    fetchData();
  }, []);

  let view = isLoading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating={isLoading} color="#00f0ff" />
      <Text style={styles.loadingText}>Загрузка..</Text>
    </View>
  ) : (
    <ScrollView>
      {data && data.map((item, index) => (
        <DataItem key={index} onPress={handleItemDataOnPress} data={item} />
      ))}
    </ScrollView>
  );

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>НОВОСТИ ПРО СПОРТ</Text>
      {view}
      <Modal 
        showModal={modalVisible}
        articleData={modalArticleData}
        onClose={handleModalClose}
      />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  title: {
    marginTop:50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default NewsScreen;
