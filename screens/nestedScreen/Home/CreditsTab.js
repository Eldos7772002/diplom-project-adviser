import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list'
import { BarChart, PieChart} from 'react-native-chart-kit';

import * as SQLite from 'expo-sqlite/legacy';
const db =  SQLite.openDatabase('test.db');

const CreditsTab = () => {
    const [specialityCodesList, setSpecialityCodesList] = useState([]);
    const [selectedSpecialityCode, setSelectedSpecialityCode] = React.useState("");
    const [coursesList, setCoursesList] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [iinList, setIinList] = useState([]);
    const [selectedIin, setSelectedIin] = useState("");
    const [paymentFormList, setPaymentFormList] = useState([]);
    const [selectedPaymentForm, setSelectedPaymentForm] = useState("");
    const [chartData, setChartData] = useState({});
    const [educationLevelData, setEducationLevelData] = useState([]);
    const [stByCourseData, setStByCourseData] = useState([]);

    const getAllSpecialtyCodes = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT DISTINCT specialty_code FROM Students',
                    [],
                    (_, result) => {
                        const { rows } = result;
                        const specialtyCodes = [];
                        for (let i = 1; i < rows.length; i++) {
                            specialtyCodes.push(rows.item(i).specialty_code);
                        }
                        resolve(specialtyCodes);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };

    const getAllCourses = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT DISTINCT course FROM Students',
                    [],
                    (_, result) => {
                        const { rows } = result;
                        const courses = [];
                        for (let i = 1; i < rows.length; i++) {
                            courses.push(rows.item(i).course);
                        }
                        resolve(courses);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };

    const getAllIINs = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT DISTINCT iin FROM Students',
                    [],
                    (_, result) => {
                        const { rows } = result;
                        const iins = [];
                        for (let i = 1; i < rows.length; i++) {
                            iins.push(rows.item(i).iin);
                        }
                        resolve(iins);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };
    const getAllPaymentForms = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT DISTINCT payment_form FROM Students',
                    [],
                    (_, result) => {
                        const { rows } = result;
                        const paymentForms = [];
                        for (let i = 0; i < rows.length; i++) {
                            paymentForms.push(rows.item(i).payment_form);
                        }
                        resolve(paymentForms);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };
    const getFilteredStudentsByCourse = ({ specialty_code, course, iin, payment_form }) => {
        return new Promise((resolve, reject) => {
            // if (!validAssessmentFields.includes(assessmentField)) {
            //     reject('Invalid assessment field');
            //     return;
            // }

            // Начинаем формирование запроса
            let query = `SELECT course, COUNT(DISTINCT iin) AS iin_count FROM Students`;
            let conditions = [];
            let params = [];

            // Динамически добавляем условия в запрос
            if (specialty_code !== undefined) {
                conditions.push('specialty_code = ?');
                params.push(specialty_code);
            }
            if (course !== undefined) {
                conditions.push('course = ?');
                params.push(course);
            }
            if (iin !== undefined) {
                conditions.push('iin = ?');
                params.push(iin);
            }
            if (payment_form !== undefined) {
                conditions.push('payment_form = ?');
                params.push(payment_form);
            }

            // Если есть условия, добавляем их в запрос
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' GROUP BY course';

            // Выполнение запроса
            db.transaction(tx => {
                tx.executeSql(
                    query,
                    params,
                    (_, result) => {
                        if (result.rows.length > 0) {
                            const courses = [];
                            const iinCounts = [];
                            for (let i = 0; i < result.rows.length; i++) {
                                courses.push(result.rows.item(i).course);
                                iinCounts.push(result.rows.item(i).iin_count);
                            }
                            resolve({ labels: courses, datasets: [{ data: iinCounts }] });
                        } else {
                            reject('No data found');
                        }
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };
    const getFilteredStudentsByEducationLevel = ({ specialty_code, course, iin, payment_form }) => {
        return new Promise((resolve, reject) => {
            // Начинаем формирование запроса
            let query = `SELECT education_level, COUNT(*) AS count FROM Students`;
            let conditions = [];
            let params = [];

            // Динамически добавляем условия в запрос
            if (specialty_code !== undefined) {
                conditions.push('specialty_code = ?');
                params.push(specialty_code);
            }
            if (course !== undefined) {
                conditions.push('course = ?');
                params.push(course);
            }
            if (iin !== undefined) {
                conditions.push('iin = ?');
                params.push(iin);
            }
            if (payment_form !== undefined) {
                conditions.push('payment_form = ?');
                params.push(payment_form);
            }

            // Если есть условия, добавляем их в запрос
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' GROUP BY education_level';

            // Выполнение запроса
            db.transaction(tx => {
                tx.executeSql(
                    query,
                    params,
                    (_, result) => {
                        if (result.rows.length > 0) {
                            const educationLevels = [];
                            const percentages = [];
                            let totalCount = 0;
                            for (let i = 0; i < result.rows.length; i++) {
                                totalCount += result.rows.item(i).count;
                            }
                            for (let i = 0; i < result.rows.length; i++) {
                                const percentage = Math.round((result.rows.item(i).count / totalCount) * 100); // Используем Math.round() для округления
                                educationLevels.push(result.rows.item(i).education_level);
                                percentages.push(percentage);
                            }
                            resolve({ labels: educationLevels, datasets: [{ data: percentages }] });
                        } else {
                            reject('No data found');
                        }
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };


    const getEducationLevelStatistics = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT education_level, COUNT(*) AS count FROM Students GROUP BY education_level',
                    [],
                    (_, result) => {
                        const { rows } = result;
                        const educationLevelStatistics = [];
                        let totalCount = 0;
                        for (let i = 0; i < rows.length; i++) {
                            totalCount += rows.item(i).count;
                        }
                        for (let i = 1; i < rows.length; i++) {
                            const percentage = Math.round((rows.item(i).count / totalCount) * 100); // Используем Math.round() для округления
                            educationLevelStatistics.push({ label: rows.item(i).education_level, percentage });
                        }
                        resolve(educationLevelStatistics);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };

    useEffect(()=>{
        getAllSpecialtyCodes()
            .then(specialtyCodes => {
                setSpecialityCodesList(specialtyCodes);
            })
            .catch(error => {
                console.error('Ошибка при получении списка specialty_code:', error);
            });

        getAllCourses()
            .then(courses => {
                setCoursesList(courses);
            })
            .catch(error => {
                console.error('Ошибка при получении списка курсов:', error);
            });

        getAllIINs()
            .then(iins => {
                setIinList(iins)
            })
            .catch(error => {
                console.error('Ошибка при получении списка IIN:', error);
            });

        getAllPaymentForms()
            .then(paymentForms => {
                setPaymentFormList(paymentForms)
            })
            .catch(error => {
                console.error('Ошибка при получении списка payment_form:', error);
            });

        // getIinCountByCourse()
        //     .then(iinCountByCourse => {
        //         const courses = Object.keys(iinCountByCourse);
        //         const iinCounts = Object.values(iinCountByCourse);
        //         setChartData({ labels: courses, datasets: [{ data: iinCounts }] });
        //     })
        //     .catch(error => {
        //         console.error('Ошибка при получении статистики по IIN по курсу:', error);
        //     });

        // getEducationLevelStatistics()
        //     .then(statistics => {
        //         setEducationLevelData(statistics);
        //     })
        //     .catch(error => {
        //         console.error('Ошибка при получении статистики по уровню образования:', error);
        //     });
        const params = {
            specialty_code: selectedSpecialityCode,
            course: selectedCourse,
            iin: selectedIin,
            payment_form: selectedPaymentForm,
        };
        console.log(params)
        if ( selectedSpecialityCode && selectedCourse && selectedIin && selectedPaymentForm) {

            getFilteredStudentsByCourse(params)
                .then(res => {
                    // const courses = Object.keys(res);
                    // console.log(res)
                    //
                    // const iinCounts = Object.values(res);
                    // setStByCourseData({ labels: courses, datasets: [{ data: iinCounts }] });
                    setStByCourseData(res);

                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
        const ByCourse = {
            specialty_code: selectedSpecialityCode,
            course: selectedCourse,
            iin: selectedIin,
            payment_form: selectedPaymentForm,
        };
        if ( selectedSpecialityCode && selectedCourse && selectedIin && selectedPaymentForm) {

            getFilteredStudentsByEducationLevel(ByCourse)
                .then(res => {
                    // const courses = Object.keys(res);
                    // console.log(res)
                    //
                    // const iinCounts = Object.values(res);
                    // setStByCourseData({ labels: courses, datasets: [{ data: iinCounts }] });
                    setEducationLevelData(res);

                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    },[selectedSpecialityCode, selectedCourse, selectedIin, selectedPaymentForm]);
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
            <View style={{flex: 1, flexDirection: 'column', rowGap: 20, padding: 30}}>
                <View>
                    <Text style={{fontSize: 18, marginBottom: 10}}>Код специальности</Text>
                    <SelectList
                        setSelected={(val) => setSelectedSpecialityCode(val)}
                        data={specialityCodesList}
                        save="value"
                        placeholder="Все"
                        searchPlaceholder="Поиск"
                    />
                </View>
                <View>
                    <Text style={{fontSize: 18, marginBottom: 10}}>Курс</Text>
                    <SelectList
                        setSelected={(val) => setSelectedCourse(val)}
                        data={coursesList}
                        save="value"
                        placeholder="Курс"
                        search={false}
                    />
                </View>
                <View>
                    <Text style={{fontSize: 18, marginBottom: 10}}>ИИН студента</Text>
                    <SelectList
                        setSelected={(val) => setSelectedIin(val)}
                        data={iinList}
                        save="value"
                        placeholder="ИИН"
                        searchPlaceholder="Поиск по ИИН"
                    />
                </View>
                <View>
                    <Text style={{fontSize: 18, marginBottom: 10}}>Форма оплаты</Text>
                    <SelectList
                        setSelected={(val) => setSelectedPaymentForm(val)}
                        data={paymentFormList}
                        save="value"
                        placeholder="Форма оплаты"
                        search={false}
                    />
                </View>
                {stByCourseData && stByCourseData.labels && stByCourseData.datasets && (
                    <View>
                        <Text style={{paddingBottom: 15, fontWeight: 600, textAlign: 'center', fontSize: 20}}>Студенты в разрезе по курсам обучения</Text>
                        <BarChart
                            data={stByCourseData}
                            width={320}
                            height={220}
                            yAxisSuffix=""
                            yAxisLabel=""
                            chartConfig={
                                {
                                    backgroundGradientFrom: '#fff',
                                    backgroundGradientTo: '#fff',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(0, 173, 230, ${opacity})`, // Цвет столбцов
                                    style: {
                                        borderRadius: 16,
                                    },
                                    barPercentage: 2.5, // Относительная ширина столбцов
                                    propsForVerticalLabels: {
                                        fontSize: 10,
                                    },
                                    propsForLabels: {
                                        fontSize: 10,
                                    },
                                    propsForBackgroundLines: {
                                        stroke: '#E8E8E8',
                                    },
                                    propsForDots: {
                                        r: '0',
                                        strokeWidth: '2',
                                        stroke: '#ffa726',
                                    },

                                }
                            }
                            verticalLabelRotation={30}
                            fromZero={true}
                        />
                    </View>
                )}
                {educationLevelData &&(
                    <View>
                        <Text style={{paddingBottom: 8, fontWeight: 600, textAlign: 'center',  fontSize: 20}}>Студенты в разрезе уровня обучения</Text>
                        <PieChart
                            data={educationLevelData.map(item => ({
                                name: '%'+ item.label,
                                population: item.percentage,
                                color: getRandomColor(), // Функция для генерации случайного цвета
                                legendFontColor: '#7F7F7F',
                                legendFontSize: 13,
                            }))}
                            width={340}
                            height={220}
                            chartConfig={{
                                backgroundGradientFrom: '#fff',
                                backgroundGradientTo: '#fff',
                                color: (opacity = 1) => `rgba(0, 173, 280, ${opacity})`, // Цвет текста
                            }}
                            accessor={"population"}
                            backgroundColor="transparent"
                            paddingLeft="6"
                            absolute
                        />
                    </View>
                )}
            </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
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
    }

});

export default CreditsTab;