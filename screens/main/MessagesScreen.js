import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Button, ActivityIndicator, FlatList, TextInput, Dimensions } from 'react-native'; // Import Dimensions module
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';
import * as SQLite from 'expo-sqlite/legacy';
import { BarChart } from 'react-native-chart-kit';
import Table from './Table'; // Предполагается, что компонент Table находится в отдельном файле и импортируется таким образом

const db = SQLite.openDatabase('test.db');

const MessagesScreen = () => {
    const [excelData, setExcelData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [gpaStatistics, setGpaStatistics] = useState(null);
    const handlePickDocument = async () => {
        setLoading(true);
        console.log('Выбор документа начат...');

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                maxSize: 1024 * 1024 * 30, // ограничение до 10 МБ
            });
            console.log(result);

            if (!result.cancelled) {
                console.log('Документ выбран:', result.assets[0].uri);

                // Удаление таблицы перед созданием новой
                await dropAndCreateTable();

                const response = await fetch(result.assets[0].uri);
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                console.log(sheetName)
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                setExcelData(jsonData);
                setLoading(false);

                await insertDataIntoTable(jsonData.slice(1)); // Пропустить первую строку с заголовками

                console.log('Установлено состояние загрузки в false.');
            }
        } catch (error) {
            console.error('Ошибка при выборе документа:', error);
            setLoading(false);
        }
    };

    const dropAndCreateTable = () => {
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    tx.executeSql(
                        'DROP TABLE IF EXISTS Students',
                        [],
                        () => {
                            console.log('Таблица успешно удалена');
                            createTable(tx);
                        },
                        error => {
                            console.error('Ошибка при удалении таблицы:', error);
                            reject(error);
                        }
                    );
                },
                error => {
                    console.error('Ошибка транзакции при удалении таблицы:', error);
                    reject(error);
                },
                () => {
                    console.log('Транзакция удаления таблицы успешно завершена');
                    resolve();
                }
            );
        });
    };

    const createTable = (tx) => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Students (id INTEGER PRIMARY KEY AUTOINCREMENT, last_name TEXT, first_name TEXT, middle_name TEXT, iin TEXT, specialty_code TEXT, specialty_name TEXT, graduation_year TEXT, admission_year TEXT, course TEXT, payment_form TEXT, language_of_study TEXT, form_of_study TEXT, education_level TEXT, academic_status TEXT, status TEXT, discipline_code TEXT, discipline_name TEXT, attestation_1 TEXT, attestation_2 TEXT, exam TEXT, total_score TEXT, letter_grade TEXT, annual_gpa TEXT, cumulative_gpa TEXT, semester_gpa TEXT)',
            [],
            () => {
                console.log('Таблица успешно создана');
            },
            error => {
                console.error('Ошибка при создании таблицы:', error);
            }
        );
    };

    // const insertDataIntoTable = async (data) => {
    //     const BATCH_SIZE = 100; // Размер пакета для вставки
    //     const totalRecords = data.length;
    //
    //     for (let i = 0; i < totalRecords; i += BATCH_SIZE) {
    //         const batch = data.slice(i, i + BATCH_SIZE);
    //         await insertBatch(batch);
    //     }
    // };

    const insertBatch = (batch) => {
        return new Promise((resolve, reject) => {
            db.transaction(
                tx => {
                    const placeholders = batch.map(() => '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').join(',');
                    const values = batch.reduce((acc, curr) => acc.concat(Object.values(curr)), []);
                    const query = `INSERT INTO Students (last_name, first_name, middle_name, iin, specialty_code, specialty_name, graduation_year, admission_year, course, payment_form, language_of_study, form_of_study, education_level, academic_status, status, discipline_code, discipline_name, attestation_1, attestation_2, exam, total_score, letter_grade, annual_gpa, cumulative_gpa, semester_gpa) VALUES ${placeholders}`;

                    tx.executeSql(
                        query,
                        values,
                        () => {
                            console.log('Пакет данных успешно вставлен');
                            resolve();
                        },
                        error => {
                            console.error('Ошибка при вставке пакета данных:', error);
                            reject(error);
                        }
                    );
                },
                error => {
                    console.error('Ошибка транзакции при вставке данных:', error);
                    reject(error);
                },
                () => {
                    console.log('Транзакция вставки данных успешно завершена');
                }
            );
        });
    };

    // const getSemesterGpaStatistics = () => {
    //     db.transaction(tx => {
    //         tx.executeSql(
    //             'SELECT semester_gpa FROM Students',
    //             [],
    //             (_, result) => {
    //                 const { rows } = result;
    //                 const gpas = [];
    //                 for (let i = 0; i < rows.length; i++) {
    //                     gpas.push(rows.item(i).semester_gpa);
    //                 }
    //                 const maxGpa = Math.max(...gpas);
    //                 const minGpa = Math.min(...gpas);
    //                 const averageGpa = gpas.reduce((acc, gpa) => acc + gpa, 0) / gpas.length;
    //                 const count = gpas.length;
    //                 setGpaStatistics({ average: averageGpa, count, maxGpa, minGpa });
    //             },
    //             error => {
    //                 console.error('Error fetching semester_gpa:', error);
    //             }
    //         );
    //     });
    // };
  const handleCountRecords = () => {
    db.transaction(tx => {
      tx.executeSql(
          'SELECT COUNT(*) FROM Students',
          [],
          (_, result) => {
            const count = result.rows.item(0)['COUNT(*)'];
            alert(`Количество записей в таблице: ${count}`);
          },
          error => {
            console.error('Ошибка при выполнении запроса на подсчет записей:', error);
          }
      );
    });
  };
  const handleSelectStudents = () => {
    db.transaction(tx => {
      tx.executeSql(
          'SELECT * FROM Students',
          [],
          (_, result) => {
            const { rows } = result;
            const studentsArray = [];
            for (let i = 0; i < rows.length; i++) {
              studentsArray.push(rows.item(i));
            }
            setStudents(studentsArray);
            console.log('Результаты запроса:', studentsArray);
          },
          error => {
            console.error('Ошибка при выполнении запроса на выборку данных', error);
          }
      );
    });
  };
    const insertDataIntoTable = (dataArray) => {
        db.transaction(
            tx => {
                // Создаем SQL-запрос для пакетной вставки данных
                const placeholders = dataArray.map(() => '  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
                const values = dataArray.reduce((acc, curr) => acc.concat(Object.values(curr)), []);
                const query = `INSERT INTO Students (last_name, first_name, middle_name, iin, specialty_code, specialty_name, graduation_year, admission_year, course, payment_form, language_of_study, form_of_study, education_level, academic_status, status, discipline_code, discipline_name, attestation_1, attestation_2, exam, total_score, letter_grade, annual_gpa, cumulative_gpa, semester_gpa) VALUES ${placeholders}`;

                // Выполняем пакетную вставку данных в базу данных
                tx.executeSql(
                    query,
                    values,
                    (_, result) => {
                        console.log('Данные успешно вставлены');
                    },
                    (_, error) => {
                        console.error('Ошибка при вставке данных:', error);
                    }
                );
            },
            null,
            () => {
                alert('Данные загружены');
                console.log('Транзакция завершена');
            }
        );
    };


    const getSemesterGpaStatistics2 = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT COUNT(semester_gpa) AS count, AVG(semester_gpa) AS average, MAX(semester_gpa) AS maxGpa, MIN(semester_gpa) AS minGpa FROM Students',
                [],
                (_, result) => {
                    const { rows } = result;
                    if (rows.length > 0) {
                        const statistics = rows.item(0);
                        console.log('Статистика по :', statistics);
                        // В этом месте вы можете передать статистику в состояние компонента или воспользоваться другой логикой для ее обработки
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


    const handleClearTable = () => {
    db.transaction(
        tx => {
          tx.executeSql('DELETE FROM Students', [], (_, result) => {
            console.log('Таблица очищена');
            setStudents([]);
          });
        },
        error => {
          console.error('Ошибка при очистке таблицы:', error);
        }
    );
  };
  const handleSearchById = () => {
    db.transaction(tx => {
      tx.executeSql(
          'SELECT * FROM Students WHERE id = ?',
          [searchId],
          (_, result) => {
            const { rows } = result;
            if (rows.length > 0) {
              const student = rows.item(0);
              setSearchResult(student);
              console.log('Результат поиска:', student);
            } else {
              setSearchResult(null);
              console.log('Студент с таким ID не найден');
            }
          },
          error => {
            console.error('Ошибка при выполнении запроса на поиск данных', error);
          }
      );
    });
  };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.container}>
        <Text style={styles.title}>Сообщения</Text>
        <Button title="Выбрать файл" onPress={handlePickDocument} />
        <Button title="Выбрать студентов" onPress={handleSelectStudents} />
        <Button title="Очистить таблицу" onPress={handleClearTable} />
        <Button title="Посчитать записи" onPress={handleCountRecords} />
          <Button title="Статистика по GPA" onPress={getSemesterGpaStatistics} />

        {loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        {/* Кнопка и текстовое поле для поиска */}
        <View style={styles.searchContainer}>
          <TextInput
              style={styles.input}
              placeholder="Введите ID"
              value={searchId}
              onChangeText={text => setSearchId(text)}
          />
          <Button title="Найти" onPress={handleSearchById} />
        </View>
          {/*{gpaStatistics && (*/}
          {/*    <View style={styles.chartContainer}>*/}
          {/*        <Text style={styles.resultText}>Статистика по semester_gpa:</Text>*/}
          {/*        <BarChart*/}
          {/*            data={{*/}
          {/*                labels: ['Минимальное GPA', 'Среднее GPA', 'Максимальное GPA'],*/}
          {/*                datasets: [*/}
          {/*                    {*/}
          {/*                        data: [gpaStatistics.minGpa, gpaStatistics.average, gpaStatistics.maxGpa],*/}
          {/*                    },*/}
          {/*                ],*/}
          {/*            }}*/}
          {/*            width={300}*/}
          {/*            height={200}*/}
          {/*            yAxisSuffix=""*/}
          {/*            chartConfig={{*/}
          {/*                backgroundColor: '#ffffff',*/}
          {/*                backgroundGradientFrom: '#ffffff',*/}
          {/*                backgroundGradientTo: '#ffffff',*/}
          {/*                decimalPlaces: 2,*/}
          {/*                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,*/}
          {/*                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,*/}
          {/*                style: {*/}
          {/*                    borderRadius: 16,*/}
          {/*                },*/}
          {/*            }}*/}
          {/*            verticalLabelRotation={30}*/}
          {/*        />*/}
          {/*    </View>*/}
          {/*)}*/}
          {gpaStatistics && (
              <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Статистика по semester_gpa:</Text>
                  <BarChart
                      data={{
                          labels: ['Минимальное GPA', 'Среднее GPA', 'Максимальное GPA'],
                          datasets: [
                              {
                                  data: [
                                      parseFloat(gpaStatistics.minGpa),
                                      parseFloat(gpaStatistics.average),
                                      parseFloat(gpaStatistics.maxGpa)
                                  ],
                              },
                          ],
                      }}
                      width={Dimensions.get('window').width - 40} // ширина графика равна ширине экрана минус отступы
                      height={200}
                      yAxisSuffix=""
                      chartConfig={{
                          backgroundColor: '#ffffff',
                          backgroundGradientFrom: '#ffffff',
                          backgroundGradientTo: '#ffffff',
                          decimalPlaces: 2,
                          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                          style: {
                              borderRadius: 16,
                          },
                      }}
                      verticalLabelRotation={30}
                  />
              </View>
          )}
        {/* Отображение результата поиска */}
          {searchResult ? (
              <View style={styles.resultContainer}>
                  <Text style={styles.resultText}>Результат поиска:</Text>
                  <Table data={searchResult} />
              </View>
          ) : null}
      </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width:'100%'

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
    },
  resultContainer: {
      width:'100%',
    marginVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
      overflow: "visible"

  },
  resultText: {
    fontWeight: 'bold',
      width:100,
    marginBottom: 5,
  },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'gray',
    },
    cell: {
        flex: 1,
        padding: 10,
        textAlign: 'center',
    },
});

export default MessagesScreen;