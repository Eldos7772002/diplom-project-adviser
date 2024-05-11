import { SQLite } from 'expo-sqlite/next';

// Открываем или создаем базу данных
const db = SQLite.openDatabase('test.db');
const insertDataIntoTable = (data) => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Students (\n' +
            '    id INTEGER PRIMARY KEY AUTOINCREMENT,\n' +
            '    last_name TEXT,\n' +
            '    first_name TEXT,\n' +
            '    middle_name TEXT,\n' +
            '    iin TEXT,\n' +
            '    specialty_code TEXT,\n' +
            '    specialty_name TEXT,\n' +
            '    graduation_year INTEGER,\n' +
            '    admission_year INTEGER,\n' +
            '    course INTEGER,\n' +
            '    payment_form TEXT,\n' +
            '    language_of_study TEXT,\n' +
            '    form_of_study TEXT,\n' +
            '    education_level TEXT,\n' +
            '    academic_status TEXT,\n' +
            '    status TEXT,\n' +
            '    discipline_code TEXT,\n' +
            '    discipline_name TEXT,\n' +
            '    attestation_1 TEXT,\n' +
            '    attestation_2 TEXT,\n' +
            '    exam TEXT,\n' +
            '    total_score REAL,\n' +
            '    letter_grade TEXT,\n' +
            '    annual_gpa REAL,\n' +
            '    cumulative_gpa REAL,\n' +
            '    semester_gpa REAL\n' +
            ');\n',
            [],
            (_, result) => {
                console.log('Таблица успешно создана или уже существует');
            },
            error => {
                console.error('Ошибка при создании таблицы:', error);
            }
        );

        data.forEach(item => {
            tx.executeSql(
                'INSERT INTO Students (last_name, first_name, middle_name, iin, specialty_code, specialty_name, graduation_year, admission_year, course, payment_form, language_of_study, form_of_study, education_level, academic_status, status, discipline_code, discipline_name, attestation_1, attestation_2, exam, total_score, letter_grade, annual_gpa, cumulative_gpa, semester_gpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                item,
                (_, result) => {
                    console.log('Данные успешно вставлены');
                },
                error => {
                    console.error('Ошибка при вставке данных:', error);
                }
            );
        });
    });
};

// Передаем данные из excelData для вставки в таблицу

// Создаем таблицу пользователей
db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE Students (\n' +
    '    id INTEGER PRIMARY KEY AUTOINCREMENT,\n' +
    '    last_name TEXT,\n' +
    '    first_name TEXT,\n' +
    '    middle_name TEXT,\n' +
    '    iin TEXT,\n' +
    '    specialty_code TEXT,\n' +
    '    specialty_name TEXT,\n' +
    '    graduation_year INTEGER,\n' +
    '    admission_year INTEGER,\n' +
    '    course INTEGER,\n' +
    '    payment_form TEXT,\n' +
    '    language_of_study TEXT,\n' +
    '    form_of_study TEXT,\n' +
    '    education_level TEXT,\n' +
    '    academic_status TEXT,\n' +
    '    status TEXT,\n' +
    '    discipline_code TEXT,\n' +
    '    discipline_name TEXT,\n' +
    '    attestation_1 TEXT,\n' +
    '    attestation_2 TEXT,\n' +
    '    exam TEXT,\n' +
    '    total_score REAL,\n' +
    '    letter_grade TEXT,\n' +
    '    annual_gpa REAL,\n' +
    '    cumulative_gpa REAL,\n' +
    '    semester_gpa REAL\n' +
        ');\n',
        [],
        (_, result) => {
            console.log('Таблица Users создана успешно');
        },
        error => {
            console.error('Ошибка при создании таблицы Users', error);
        }
    );

});

// Добавляем нового пользователя
db.transaction(tx => {
    tx.executeSql(
        'INSERT INTO Students (username, email, password) VALUES (?, ?, ?)',
        ['user123', 'user@example.com', 'password123'],
        (_, result) => {
            console.log('Пользователь добавлен успешно');
        },
        error => {
            console.error('Ошибка при добавлении пользователя', error);
        }
    );
});

// Выполняем запрос на выборку данных
db.transaction(tx => {
    tx.executeSql(
        'SELECT * FROM Students',
        [],
        (_, result) => {
            console.log('Результаты запроса:', result.rows._array);
        },
        error => {
            console.error('Ошибка при выполнении запроса на выборку данных', error);
        }
    );
});
