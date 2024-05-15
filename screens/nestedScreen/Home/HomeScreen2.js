import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, SafeAreaView } from "react-native";
import { Feather } from '@expo/vector-icons';
import { authSignOutUser } from "../../../redux/auth/authOperations";
import { PublicPosts } from "../../../components/PublicPosts";
import { getAllPosts } from "../../../redux/posts/postsOperations";

const HomeScreen2 = ({ navigation, route }) => {
    const { allItems: allPosts } = useSelector((state) => state.posts);
    const { userPhoto, email, nickname } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllPosts());
    }, []);

    const signOut = () => {
        dispatch(authSignOutUser());
    };

    useEffect(() => {
        if (route.params) {
            setPosts((prevState) => [...prevState, route.params]);
        }
    }, [route.params]);

    const renderItem = ({ item }) => (
        <PublicPosts item={item} navigation={navigation} />
    );

    const ListHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.userInfoContainer}>
                    <Image style={styles.avatar} source={{ uri: userPhoto }} />
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{nickname}</Text>
                        <Text style={styles.email}>{email}</Text>
                    </View>
                </View>
                <View style={styles.separator}></View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Посты</Text>
                <TouchableOpacity onPress={signOut}>
                    <Feather name="log-out" size={24} color="#757575" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={allPosts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={ListHeader}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    headerTitle: {
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        color: '#212121',
    },
    headerRightIcon: {
        paddingHorizontal: 16,
    },
    headerRightIconText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        color: '#757575',
    },
    headerContainer: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#BDBDBD',
    },
    userInfo: {
        marginLeft: 12,
    },
    username: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        color: '#212121',
    },
    email: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        color: '#757575',
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
});

export default HomeScreen2;
