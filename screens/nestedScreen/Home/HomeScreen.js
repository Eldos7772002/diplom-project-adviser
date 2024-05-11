import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView,ScrollView } from "react-native";
import { Feather } from '@expo/vector-icons';
import { authSignOutUser } from "../../../redux/auth/authOperations";
import { getAllPosts } from "../../../redux/posts/postsOperations";
import CreditsTab from "./CreditsTab";
import * as SQLite from 'expo-sqlite/legacy';
import ScoresTab from "./ScoresTab";
const db = SQLite.openDatabase('test.db');

const HomeScreen = ({ navigation, route }) => {
    const { allItems: allPosts } = useSelector((state) => state.posts);
    const { userPhoto, email, nickname } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [gpaStatistics, setGpaStatistics] = useState(null); // Статистика GPA
    const [selectedTab, setSelectedTab] = useState(1);

    const tabs = [
        { id: 1, label: 'Кредиты' },
        { id: 2, label: 'Оценки' },
        { id: 3, label: 'Пропуски' },
    ];

    const handleTabChange = (id) => {
        setSelectedTab(id);
    };

    useEffect(() => {
        dispatch(getAllPosts());
        getSemesterGpaStatistics(); // Получаем статистику при загрузке компонента
    }, []);

    const signOut = () => {
        dispatch(authSignOutUser());
    };

    const GeneralStatistics = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.userInfoContainer}>
                    <Image style={styles.avatar} source={{ uri: userPhoto }} />
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{nickname}</Text>
                        <Text style={styles.email}>{email}</Text>
                    </View>
                </View>
                {gpaStatistics && (
                    <View style={{borderBottomWidth: 1, borderBottomColor: '#E8E8E8', minHeight: 120}}>
                        <Text style={styles.generalStats.header}>Статистика по GPA:</Text>
                        <View style={styles.generalStats.container}>
                            <View style={styles.generalStats.column}>
                                <View style={styles.generalStats.item}>
                                    <Text style={styles.generalStats.text}>Количество</Text>
                                    <Text style={styles.generalStats.text}>{gpaStatistics.count}</Text>
                                </View>
                            </View>
                            <View style={styles.generalStats.column}>
                                <View style={styles.generalStats.item}>
                                    <Text style={styles.generalStats.text}>Среднее</Text>
                                    <Text style={styles.generalStats.text}>
                                        {gpaStatistics.average === null ? "1" : gpaStatistics.average.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.generalStats.column}>
                                <View style={styles.generalStats.item}>
                                    <Text style={styles.generalStats.text}>Макс</Text>
                                    <Text style={styles.generalStats.text}> {gpaStatistics.maxGpa}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

            </View>

        )
    }

    const getSemesterGpaStatistics = async () => {
        return new Promise((resolve, reject) => {
            db.transaction(
                async tx => {
                    tx.executeSql(
                        'SELECT COUNT(semester_gpa) AS count, AVG(semester_gpa) AS average, MAX(semester_gpa) AS maxGpa, MIN(semester_gpa) AS minGpa FROM Students',
                        [],
                        (_, result) => {
                            const { rows } = result;
                            if (rows.length > 0) {
                                const statistics = rows.item(0);
                                setGpaStatistics(statistics);
                                resolve();
                            } else {
                                console.log('Нет данных для вычисления статистики по semester_gpa');
                                reject('Нет данных для вычисления статистики по semester_gpa');
                            }
                        },
                        error => {
                            console.error('Ошибка при выполнении запроса на получение статистики', error);
                            reject(error);
                        }
                    );
                },
                error => {
                    console.error('Ошибка при выполнении транзакции', error);
                    reject(error);
                }
            );
        });
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Статистика</Text>
                    <TouchableOpacity onPress={signOut}>
                        <Feather name="log-out" size={24} color="#BDBDBD" />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                <GeneralStatistics />
                    <View style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
                        <View style={styles.tabContainer}>
                            {tabs.map(tab => (
                                <TouchableOpacity key={`${tab.id}-${tab.label}`} onPress={() => handleTabChange(tab.id)}>
                                    <View style={selectedTab === tab.id ? styles.tabActive : styles.tabDefault}>
                                        <Text>{tab.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}

                        </View>
                    </View>
                    {selectedTab === 1 && (
                        <View >
                            <CreditsTab />
                        </View>
                    )}
                    {selectedTab === 2 && (
                        <View >
                            <ScoresTab />
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
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
        lineHeight: 24,
        color: '#212121',
    },
    headerRightIcon: {
        paddingHorizontal: 16,
    },
    headerRightIconText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        lineHeight: 19,
        color: '#BDBDBD',
    },
    headerContainer: {
        paddingTop: 10,
        // paddingHorizontal: 16

    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        width: '100%',
    },
    avatar: {
        width: 50,
        height: 50,
        marginLeft: 20,
        borderRadius: 25,
        backgroundColor: '#BDBDBD',
    },
    userInfo: {
        marginLeft: 12,
    },
    username: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        lineHeight: 19,
        color: '#212121',
    },
    email: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 16,
        color: '#757575',
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
        marginBottom: 20,
    },
    statisticsText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        lineHeight: 19,
        color: '#212121',
        marginBottom: 10,
    },
    generalStats: {
        header: {
            fontSize: 22,
            lineHeight: 26,
            textAlign: 'center',
            marginBottom: 10
        },
        container: {
            flex: 1,
            flexDirection: 'row', // Располагаем колонки в ряд
            padding: 5
        },
        column: {
            flex: 1, // Распределение пространства между колонками
            alignItems: 'center', // Выравнивание по центру по горизонтали
            height: '100%'
        },
        item: {
            width: '90%', // Ширина элемента
            marginVertical: 10, // Вертикальный отступ между элементами
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            height: 50,
            borderRadius: 14
        },
        text: {
        },
    },
    tabContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        width: '100%', // Make sure the container takes full width
        justifyContent: 'space-between', // This will ensure spacing between the tabs if needed
    },
    tabActive: {
        fontSize: 21,
        fontFamily: 'Roboto-Medium',
        paddingVertical: 20,
        paddingHorizontal: 33,
        color: '#333',
        backgroundColor: "#fff", // Changed to white or any other color as per UI design
        flex: 1, // Takes equal space
        textAlign: 'center', // Centers the text within the tab
    },
    tabDefault: {
        fontSize: 21,
        fontFamily: 'Roboto-Medium',
        paddingVertical: 20,
        paddingHorizontal: 33,
        backgroundColor: "#f5f5f5",
        color: '#333',
        flex: 1, // Takes equal space
        textAlign: 'center', // Centers the text within the tab
    }
});

export default HomeScreen;
