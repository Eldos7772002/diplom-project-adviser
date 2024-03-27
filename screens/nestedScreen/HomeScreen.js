import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, SafeAreaView } from "react-native";
import { Feather } from '@expo/vector-icons';
import { authSignOutUser } from "../../redux/auth/authOperations";
import { PublicPosts } from "../../components/PublicPosts";
import { getAllPosts } from "../../redux/posts/postsOperations";
import { LineChart } from 'react-native-chart-kit';

import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('test.db');

const HomeScreen = ({ navigation, route }) => {
    const { allItems: allPosts } = useSelector((state) => state.posts);
    const { userPhoto, email, nickname } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [gpaStatistics, setGpaStatistics] = useState(null); // Статистика GPA

    useEffect(() => {
        dispatch(getAllPosts());
        getSemesterGpaStatistics(); // Получаем статистику при загрузке компонента
    }, []);

    const signOut = () => {
        dispatch(authSignOutUser());
    };

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

                {gpaStatistics && (
                    <View style={styles.statisticsContainer}>
                        <Text style={styles.statisticsText}>Статистика по GPA:</Text>
                        <Text>Количество: {gpaStatistics.count}</Text>
                        <Text>Среднее: {gpaStatistics.average}</Text>
                        <Text>Максимальное: {gpaStatistics.maxGpa}</Text>
                        <Text>Минимальное: {gpaStatistics.minGpa}</Text>
                        <LineChart
                            data={{
                                labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                                datasets: [
                                    {
                                        data: [20, 45, 28, 80, 99, 43],
                                    },
                                ],
                            }}
                            width={390} // from react-native
                            height={250}
                            yAxisLabel={'gpa'}
                            chartConfig={{
                                backgroundColor: '#e26a00',
                                backgroundGradientFrom: '#fb8c00',
                                backgroundGradientTo: '#ffa726',
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: '6',
                                    strokeWidth: '2',
                                    stroke: '#ffa726',
                                },
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </View>
                )}

            </View>

        )
    }

    const getSemesterGpaStatistics = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT COUNT(semester_gpa) AS count, AVG(semester_gpa) AS average, MAX(semester_gpa) AS maxGpa, MIN(semester_gpa) AS minGpa FROM Students',
                [],
                (_, result) => {
                    const { rows } = result;
                    if (rows.length > 0) {
                        const statistics = rows.item(0);
                        setGpaStatistics(statistics); // Обновляем состояние с полученной статистикой
                        console.log('Статистика по semester_gpa:', statistics);
                    } else {
                        console.log('Нет данных для вычисления статистики по semester_gpa');
                    }
                },
                error => {
                    console.error('Ошибка при выполнении запроса на получение статистики', error);
                }
            );
        });
    };
    const fetchGradesStatistics = async (course, specialty, discipline, language) => {
        try {
            // Формируем SQL-запрос на основе выбранных параметров
            let sqlQuery = 'SELECT AVG(total_score) AS averageScore, MAX(total_score) AS maxScore, MIN(total_score) AS minScore ';
            sqlQuery += 'FROM Students WHERE 1 = 1'; // Начальное условие

            // Добавляем условия выборки в SQL-запрос в зависимости от переданных параметров
            if (course) {
                sqlQuery += ` AND course = ${course}`;
            }
            if (specialty) {
                sqlQuery += ` AND specialty_code = '${specialty}'`;
            }
            if (discipline) {
                sqlQuery += ` AND discipline_code = '${discipline}'`;
            }
            if (language) {
                sqlQuery += ` AND language_of_study = '${language}'`;
            }

            // Выполняем SQL-запрос к базе данных
            const result = await new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(
                        sqlQuery,
                        [],
                        (_, { rows }) => resolve(rows),
                        (_, error) => reject(error)
                    );
                });
            });

            // Проверяем, получены ли данные
            if (result.length > 0) {
                const statistics = result.item(0);
                console.log('Статистика по предметам:', statistics);
                return statistics;
            } else {
                console.log('Нет данных для статистики по предметам');
                return null;
            }
        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
            // Обработка ошибки, например, вывод сообщения об ошибке на экран
            return null;
        }
    };


    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Посты</Text>
                    <TouchableOpacity onPress={signOut}>
                        <Feather name="log-out" size={24} color="#BDBDBD" />
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
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingHorizontal: 16,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
    statisticsContainer: {
        marginBottom: 20,
    },
    statisticsText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        lineHeight: 19,
        color: '#212121',
        marginBottom: 10,
    },
});

export default HomeScreen;
