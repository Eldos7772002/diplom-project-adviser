import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const russianKeys = {
    academic_status: 'Академический статус',
    admission_year: 'Год поступления',
    annual_gpa: 'Годовой GPA',
    attestation_1: 'Аттестация 1',
    attestation_2: 'Аттестация 2',
    course: 'Курс',
    cumulative_gpa: 'Кумулятивный GPA',
    discipline_code: 'Код дисциплины',
    discipline_name: 'Название дисциплины',
    education_level: 'Уровень образования',
    exam: 'Экзамен',
    first_name: 'Имя',
    form_of_study: 'Форма обучения',
    graduation_year: 'Год выпуска',
    id: 'ID',
    iin: 'ИИН',
    language_of_study: 'Язык обучения',
    last_name: 'Фамилия',
    letter_grade: 'Оценка по буквенной системе',
    middle_name: 'Отчество',
    payment_form: 'Форма оплаты',
    semester_gpa: 'Семестровый GPA',
    specialty_code: 'Код специальности',
    specialty_name: 'Название специальности',
    status: 'Статус',
    total_score: 'Общий балл',
};

const Table = ({ data }) => {
    return (
        <View style={styles.table}>
            {Object.keys(data).map((key, index) => (
                <View key={index} style={styles.row}>
                    <Text style={styles.label}>{russianKeys[key] ? russianKeys[key] : key}</Text>
                    <Text style={styles.value}>{data[key]}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row', // Устанавливаем направление строки на горизонтальное
        justifyContent: 'space-between', // Выравниваем элементы по краям
        marginBottom: 5, // Добавляем вертикальные отступы между строками
        width:'100%'
    },
    label: {
        fontWeight: 'bold',
        marginRight: 20,
        width:'40%'
    },
    value: {
        flex: 1, // Позволяет значению расширяться на всю доступную ширину элемента строки
        width:'55%'
    },
});

export default Table;