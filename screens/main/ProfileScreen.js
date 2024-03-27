import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity, Dimensions, Image, FlatList, SafeAreaView, Modal, TextInput, Button } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from "expo-media-library";
import { AntDesign, Feather } from '@expo/vector-icons';
import { authSignOutUser, authUpdateAvatar, authUpdateNickname } from "../../redux/auth/authOperations";
import { PrivatePosts } from "../../components/PrivatePosts";
import { getOwnPosts } from "../../redux/posts/postsOperations";

const ProfileScreen = ({ navigation }) =>
{
  const { height, width } = Dimensions.get('window');
  const { nickname, userId, userPhoto } = useSelector((state) => state.auth);
  const { items: posts } = useSelector((state) => state.posts);
  const [profileImage, setProfileImage] = useState(userPhoto);
  const [libraryPermission, setLibraryPermission] = useState();
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOwnPosts(userId));
  }, [posts]);

  const renderItem = ({ item }) => (
    <PrivatePosts item={item} navigation={navigation} />
  );

  const pickProfileImage = async () =>
  {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    if (!result.cancelled) {
      setProfileImage(result.uri);
      dispatch(authUpdateAvatar(result.uri));
    }
  }

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
       setLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const removeProfileImage = () => {
    dispatch(authUpdateAvatar(''));
    setProfileImage('');
  }

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  const openEditNameModal = () => {
    setNewName(nickname);
    setEditName(true);
  };

  const closeEditNameModal = () => {
    setEditName(false);
  };

  const handleEditName = () => {
    dispatch(authUpdateNickname(newName));
    setEditName(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        height={height}
        width={width}
        preserveAspectRatio='xMidYMid slice'
        source={require("../../assets/images/bg.jpg")}
      >
        <View style={styles.innerBox} height={height / 1.35}>
          {profileImage ?
            <Image
              source={{ uri: profileImage }}
              style={styles.photoBox} />
            :
            <View style={styles.photoBox} />
          }
          <TouchableOpacity onPress={profileImage ? removeProfileImage : pickProfileImage}>
            <View style={profileImage ? styles.removeProfileBtn : styles.addProfileBtn}>
              {profileImage ?
                <AntDesign name="close" size={16} color="#FFFFFF" />
                :
                <AntDesign name="plus" size={16} color="#FFFFFF" />
              }
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
            <Feather name="log-out" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openEditNameModal}>
            <Text style={styles.titleText}>{nickname}</Text>
          </TouchableOpacity>
          {posts.length === 0 ? (
            <Text style={styles.noPostsText}>У вас нету постов</Text>
          ) : (
            <SafeAreaView style={{ width: '100%' }}>
              <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.flatList}
              />
            </SafeAreaView>
          )}
        </View>
      </ImageBackground>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editName}
        onRequestClose={closeEditNameModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={newName}
              onChangeText={setNewName}
            />
            <Button title="Save" onPress={handleEditName} />
            <Button title="Cancel" onPress={closeEditNameModal} color="gray" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  innerBox: {
    position: "relative",
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingHorizontal: 16,
  },
  titleText: {
    marginTop: 32,
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35.16,
    color: '#212121',
    textAlign: 'center',
  },
  noPostsText: {
    marginTop: 20,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: '#BDBDBD',
    textAlign: 'center',
  },
  photoBox: {
    marginTop: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F6F6F6',
  },
  addProfileBtn: {
    position: "absolute",
    bottom: -10,
    left: 60,
    backgroundColor: '#FF6C00',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeProfileBtn: {
    position: "absolute",
    bottom: -10,
    left: 60,
    backgroundColor: '#BDBDBD',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutBtn: {
    position: 'absolute',
    top: 32,
    right: 16,
  },
  flatList: {
    marginBottom: 120,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
