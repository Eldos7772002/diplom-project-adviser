import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list'
import { BarChart, PieChart} from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import * as SQLite from 'expo-sqlite/legacy';
const db = SQLite.openDatabase('test.db');

const screenWidth = Dimensions.get("window").width;

const ScoresTab = () => {

    const [coursesList, setCoursesList] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [specialityList, setSpecialityList] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState("");
    const [disciplinesList, setDisciplinesList] = useState([]);
    const [selectedDiscipline, setSelectedDiscipline] = useState("");
    const [languagesList, setLanguagesList] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedAssessment, setSelectedAssessment] = useState('attestation_1');
    const [data, setData] = useState({
        labels: [],
        datasets: [{ data: [] }]  // Убедитесь, что datasets тоже инициализированы
    });
    const assesmentList = [
       'Аттестация 1', 'Аттестация 2', 'Экзамен', 'Итоговая оценка'
    ];
    const pieChartData = [
        {
            name: "0 баллов",
            population: data?.datasets[0].data[0],
            color: "#f00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "< 15 баллов",
            population: data?.datasets[0].data[1],
            color: "#0f0",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "15-25 баллов",
            population: data?.datasets[0].data[2],
            color: "#00f",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "> 25 баллов",
            population: data?.datasets[0].data[3],
            color: "#ff0",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];

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


    const getAllSpecialtys = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT DISTINCT specialty_name FROM Students', // Изменяем запрос
                    [],
                    (_, result) => {
                        const { rows } = result;
                        const specialtyNames = [];
                        for (let i = 0; i < rows.length; i++) { // Исправляем индекс
                            specialtyNames.push(rows.item(i).specialty_name);
                        }
                        resolve(specialtyNames);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };


    const getAllDisciplines = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT DISTINCT discipline_name FROM Students',
                    [],
                    (_, result) => {
                        const { rows } = result;
                        const disciplines = [];
                        for (let i = 1; i < rows.length; i++) {
                            disciplines.push(rows.item(i).discipline_name);
                        }
                        resolve(disciplines);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };

    const getAllLanguages = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT DISTINCT language_of_study FROM Students',
                    [],
                    (_, result) => {
                        const { rows } = result;
                        const langs = [];
                        for (let i = 1; i < rows.length; i++) {
                            langs.push(rows.item(i).language_of_study);
                        }
                        resolve(langs);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };

    const getAssessmentStatistics = (assessmentField) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT 
                    COUNT(CASE WHEN ${assessmentField} = '0' THEN 1 END) AS zeroPoints,
                    COUNT(CASE WHEN ${assessmentField} < '15' AND ${assessmentField} > '0' THEN 1 END) AS lessThanFifteen,
                    COUNT(CASE WHEN ${assessmentField} BETWEEN '15' AND '25' THEN 1 END) AS betweenFifteenAndTwentyFive,
                    COUNT(CASE WHEN ${assessmentField} > '25' THEN 1 END) AS moreThanTwentyFive
                FROM Students`,
                    [],
                    (_, result) => {
                        if (result.rows.length > 0) {
                            resolve(result.rows.item(0));
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
    const validAssessmentFields = ['total_score', 'annual_gpa', 'cumulative_gpa', 'semester_gpa']; // Допустимые поля

    const getFilteredStudents = (selectedAssessment,params) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT ' +
                'COUNT(CASE WHEN ' + selectedAssessment + ' = 0 THEN 1 END) AS zeroPoints, ' +
                'COUNT(CASE WHEN ' + selectedAssessment + ' < 15 AND ' + selectedAssessment + ' > 0 THEN 1 END) AS lessThanFifteen, ' +
                'COUNT(CASE WHEN ' + selectedAssessment + ' BETWEEN 15 AND 25 THEN 1 END) AS betweenFifteenAndTwentyFive, ' +
                'COUNT(CASE WHEN ' + selectedAssessment + ' > 25 THEN 1 END) AS moreThanTwentyFive ' +
                'FROM Students ';
            let conditions = [];
            let queryParams = [];

            // Динамически добавляем условия в запрос на основе параметров фильтрации
            if (params.course !== undefined) {
                conditions.push('course = ?');
                queryParams.push(params.course);
            }
            if (params.specialtyName !== undefined) {
                conditions.push('specialty_name = ?');
                queryParams.push(params.specialtyName);
            }
            if (params.disciplineName !== undefined) {
                conditions.push('discipline_name = ?');
                queryParams.push(params.disciplineName);
            }
            if (params.languageOfStudy !== undefined) {
                conditions.push('language_of_study = ?');
                queryParams.push(params.languageOfStudy);
            }

            // Если есть условия, добавляем их в запрос
            if (conditions.length > 0) {
                query += 'WHERE ' + conditions.join(' AND ');
            }

            // Выполнение запроса
            db.transaction(tx => {
                tx.executeSql(
                    query,
                    queryParams,
                    (_, result) => {
                        if (result.rows.length > 0) {
                            resolve(result.rows.item(0));
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



    useEffect(()=>{
        // Параметры для фильтрации
        // const params = {
        //     course: selectedCourse !== "" ? selectedCourse : '1',
        //     specialtyName: selectedSpeciality !== "" ? selectedSpeciality : '7M06301 Комплексное обеспечение информационной безопасности',
        //     disciplineName: selectedDiscipline !== "" ? selectedDiscipline : 'Иностранный язык (профессиональный)',
        //     languageOfStudy: selectedLanguage !== "" ? selectedLanguage : 'Русский язык',
        // };
        // const params = {
        //     course: selectedCourse,
        //     specialtyName: selectedSpeciality ,
        //     disciplineName: selectedDiscipline ,
        //     languageOfStudy: selectedLanguage ,
        // };

            // console.log(params)
        // getFilteredStudents("attestation_1", params)
        //     .then(data => {
        //         console.log('Statistics:', data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching data:', error);
        //     });
        getAllCourses()
            .then(courses => {
                setCoursesList(courses);
            })
            .catch(error => {
                console.error('Ошибка при получении списка курсов:', error);
            });

        getAllSpecialtys()
            .then(specialtys => {
                setSpecialityList(specialtys);
            })
            .catch(error => {
                console.error('Ошибка при получении списка курсов:', error);
            });

        getAllDisciplines()
            .then(disciplines => {
                setDisciplinesList(disciplines);
            })
            .catch(error => {
                console.error('Ошибка при получении списка курсов:', error);
            });

        getAllLanguages()
            .then(langs => {
                setLanguagesList(langs);
            })
            .catch(error => {
                console.error('Ошибка при получении списка курсов:', error);
            });

        const params = {
            course: selectedCourse,
            specialtyName: selectedSpeciality,
            disciplineName: selectedDiscipline,
            languageOfStudy: selectedLanguage,
        };

        if (selectedAssessment && selectedCourse && selectedSpeciality && selectedDiscipline && selectedLanguage) {
            getFilteredStudents(selectedAssessment, params)
                .then(res => {
                    const newData = {
                        labels: ['0', '< 15', '15-25', '25 >'],
                        datasets: [
                            {
                                data: [
                                    res.zeroPoints,
                                    res.lessThanFifteen,
                                    res.betweenFifteenAndTwentyFive,
                                    res.moreThanTwentyFive
                                ]
                            }
                        ]
                    };
                    setData(newData);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [selectedAssessment, selectedCourse, selectedSpeciality, selectedDiscipline, selectedLanguage]);
    return(<>
    <SafeAreaView>
        <View>
            <Text>Check your console for the results.</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'column', rowGap: 20, padding: 30}}>
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
                <Text style={{fontSize: 18, marginBottom: 10}}>Специальность</Text>
                <SelectList
                    setSelected={(val) => setSelectedSpeciality(val)}
                    data={specialityList}
                    save="key"
                    placeholder="Все"
                    search={false}
                />
            </View>
            <View>
                <Text style={{fontSize: 18, marginBottom: 10}}>Дисциплина</Text>
                <SelectList
                    setSelected={(val) => setSelectedDiscipline(val)}
                    data={disciplinesList}
                    save="value"
                    placeholder="Все"
                    search={false}
                />
            </View>
            <View>
                <Text style={{fontSize: 18, marginBottom: 10}}>Язык обучения</Text>
                <SelectList
                    setSelected={(val) => setSelectedLanguage(val)}
                    data={languagesList}
                    save="value"
                    placeholder="Все"
                    search={false}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.header}>Распределение оценок</Text>
                <SelectList
                    setSelected={(val) => {
                        if (val == 'Аттестация 1'){
                        setSelectedAssessment('attestation_1')}
                        else if (val == 'Аттестация 2') {
                            setSelectedAssessment('attestation_2')
                        }
                        else if (val == 'Экзамен'){
                            setSelectedAssessment('exam')
                        }
                        else if (val == 'Итоговая оценка') {
                        setSelectedAssessment('total_score')
                        }
                    }}
                    maxHeight={120}
                    data={assesmentList}
                    save="value"
                    placeholder="Выберите аттестацию"
                    search={false}
                    fromZero={true}
                />
                <View style={{height:30}}></View>
                <Text style={{paddingBottom: 15, fontWeight: 600, textAlign: 'center', fontSize: 20}}>Успеваемость студентов по дисциплинам</Text>
                {data && data.datasets && data.datasets.length > 0 && (
                    <BarChart
                        data={data}
                        width={screenWidth *0.85}
                        height={280}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: '#1cc910',
                            backgroundGradientFrom: '#eff3ff',
                            backgroundGradientTo: '#efefef',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                        fromZero={true}
                    />
                )}
                {data && data.datasets && data.datasets[0].data && data.datasets[0].data.length === 4 && (
                    <View style={{marginTop: 15}}>
                        <Text style={{paddingBottom: 8, fontWeight: 600, textAlign: 'center',  fontSize: 20}}>Студенты в разрезе уровня обучения</Text>

                        <PieChart
                        data={pieChartData}
                        width={340}
                        height={220}
                        chartConfig={{
                            backgroundColor: '#e26a00',
                            backgroundGradientFrom: '#fb8c00',
                            backgroundGradientTo: '#ffa726',
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor={"population"}
                        center={[10, 10]}
                        backgroundColor="transparent"
                        paddingLeft="6"
                        absolute
                        />
                    </View>)
                }
            </View>

        </View>
    </SafeAreaView>
    </>)
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10,
    },
    header: {
        fontSize: 20,
    },
});

export default ScoresTab;
