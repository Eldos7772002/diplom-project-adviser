import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { StyleSheet, View, ImageBackground, Text, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Animated } from "react-native"; // Import Animated from react-native

import { authSignInUser } from "../../redux/auth/authOperations";

// Изначальное состояние для формы входа
const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  const { height, width } = Dimensions.get('window');

  // Состояния для управления видимостью пароля и фокусом полей ввода
  const [isSecureEntry, setSecureEntry] = useState(true);
  const [state, setState] = useState(initialState);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  });

  // Добавлено: состояние для анимации появления элементов
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Добавлено: запуск анимации появления после загрузки компонента
    setIsVisible(true);
  }, []);

  const dispatch = useDispatch();

  // Функции для управления фокусом полей ввода
  const onFocus = (inputName) => {
    setIsFocused({
      [inputName]: true
    })
  }

  const onBlur = (inputName) => {
    setIsFocused({
      [inputName]: false
    })
  }

  // Обработчик отправки формы входа
  const handleSubmit = () => {
    dispatch(authSignInUser(state));
    setState(initialState);
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            height={height}
            width={width}
            style={styles.container}
            keyboardVerticalOffset={-150}
        >
          <ImageBackground
              style={styles.image}
              height={height}
              width={width}
              preserveAspectRatio='xMidYWid slice'
              source={require("../../assets/images/signUp.jpg")}
          >
            <View style={styles.innerBox} height={height / 2.7}>
              <Text style={styles.titleText}>Войти</Text>
              <Animated.View style={[styles.form, { opacity: isVisible ? 1 : 0, transform: [{ translateY: isVisible ? 0 : 50 }] }]}>
                <TextInput
                    style={isFocused.email ? [styles.input, styles.inputFocused] : styles.input}
                    placeholder="Email"
                    placeholderTextColor="#BDBDBD"
                    inputmode={'email'}
                    textContentType={"emailAddress"}
                    keyboardType={'email-address'}
                    value={state.email}
                    onChangeText={(value) =>
                        setState((prevState) => ({ ...prevState, email: value }))
                    }
                    onFocus={() => onFocus('email')}
                    onBlur={() => onBlur('email')}
                />
                <View>
                  <TextInput
                      style={isFocused.password ? [styles.input, styles.inputFocused] : { ...styles.input, position: 'relative' }}
                      placeholder="Пароль"
                      placeholderTextColor="#BDBDBD"
                      textContentType={"password"}
                      secureTextEntry={isSecureEntry}
                      maxLength={10}
                      value={state.password}
                      onChangeText={(value) =>
                          setState((prevState) => ({ ...prevState, password: value }))
                      }
                      onFocus={() => onFocus('password')}
                      onBlur={() => onBlur('password')}
                  />
                  <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
                    <Text style={styles.textSecure}>{isSecureEntry ? "Посмотреть" : "Закрыть"}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.btnBox}>
                  <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btnText}>Войти</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text onPress={() => navigation.navigate("Registration")} style={styles.text}>У вас нет учетной записи? Создать аккаунт</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  innerBox: {
    position: "relative",
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    height:'100%'
    // paddingVertical: 20, // Увеличиваем вертикальный отступ внутреннего контейнера
  },
  titleText: {
    marginTop: 20, // Уменьшаем отступ сверху до заголовка
    marginBottom: 15,
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 1,
    color: "#FF6C00", // Изменяем цвет заголовка
  },
  form: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 10, // Уменьшаем отступ между полями ввода
    height: 50,
    padding: 15,
    fontFamily: "Roboto-Regular",
    color: "#212121",
    fontSize: 16,
    lineHeight: 19,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E8E8E8",
  },
  inputFocused: {
    borderColor: '#FF6C00',
    backgroundColor: '#FFFFFF'
  },
  textSecure: {
    position: "absolute",
    top: -35, // Изменяем расположение текста для скрытия пароля
    right: 20, // Изменяем расположение текста для скрытия пароля
    color: '#1B4371',
  },
  btnBox: {
    marginTop: 20, // Уменьшаем отступ между кнопкой и полями ввода
  },
  btn: {
    backgroundColor: '#1B4371', // Изменяем цвет кнопки
    borderRadius: 8, // Уменьшаем радиус скругления кнопки
  },
  btnText: {
    fontFamily: "Roboto-Regular",
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    paddingVertical: 15, // Увеличиваем вертикальные отступы текста кнопки
  },
  text: {
    marginTop: 10, // Уменьшаем отступ между кнопкой и текстом
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: '#1B4371',
    textAlign: 'center',
  }
});

