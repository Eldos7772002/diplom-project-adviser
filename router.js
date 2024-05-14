import React from "react";
import { TouchableOpacity, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { authSignOutUser } from "./redux/auth/authOperations";
import RegistrationScreen from './screens/auth/RegistrationScreen';
import LoginScreen from './screens/auth/LoginScreen';
import ProfileScreen from "./screens/main/ProfileScreen";
import CreatePostsScreen from "./screens/main/CreatePostsScreen";
import PostsScreen from "./screens/main/PostsScreen";
import MessagesScreen from "./screens/main/MessagesScreen";
import NewsScreen from "./screens/main/NewsScreen";
import Chats from "./screens/main/Chats";
import Users from "./screens/main/Users";
import Chat from "./screens/main/Chat";
import Group from "./screens/main/Group";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const useRoute = (isAuth) => {
  const dispatch = useDispatch();
  if (!isAuth) {
    return (
      <AuthStack.Navigator initialRouteName="Login">
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
      </AuthStack.Navigator>
    )
  }

  return (


    <Stack.Navigator>
        <Stack.Screen name="Home" component={MainStack} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={({ route }) => ({ headerTitle: route.params.chatName })} />
        <Stack.Screen
            name="Users"
            component={Users}
            options={{
                title: 'Select User'
            }}
        />
        {/*<Stack.Screen name="Profile" component={Profile} />*/}
        {/*<Stack.Screen name="About" component={About} />*/}
        {/*<Stack.Screen name="Help" component={Help} />*/}
        {/*<Stack.Screen name="Account" component={Account} />*/}
        <Stack.Screen name="Group" component={Group} options={{ title: 'New Group' }} />
    </Stack.Navigator>
  )
}

export const MainStack = () => (
    <MainTab.Navigator
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                height: 90,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#094780', // Измените это значение на желаемый цвет фона

            },
            tabBarActiveTintColor: '#ffffff',
        }}
    >

        <MainTab.Screen
            name='Posts'
            component={PostsScreen}
            options={({ route }) => ({
                tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons
                        name={focused ? "grid" : "grid-outline"}
                        size={size}
                        color={color}
                        style={{ alignSelf: 'center', marginTop: 10 }}
                    />
                ),
                headerRight: () => (
                    <TouchableOpacity
                        style={{ marginRight: 16, bottom: 4 }}
                        onPress={() => dispatch(authSignOutUser())}
                    >
                        <Feather name="log-out" size={24} color="#BDBDBD" />
                    </TouchableOpacity>
                ),
                headerShown: false,
            })}
        />
        <MainTab.Screen
            name='Messages'
            component={MessagesScreen}
            options={{
                tabBarIcon: ({ focused, size, color }) => (
                    <Feather
                        name={focused ? "upload" : "upload"} // Используем иконку "file-upload-outline" для загрузки файла
                        size={size}
                        color={color}
                        style={{ alignSelf: 'center', marginTop: 10 }}
                    />
                ),
                headerShown: false,
            }}
        />
        <MainTab.Screen
            name='Create post'
            component={CreatePostsScreen}
            options={({ navigation, route }) => ({
                tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons
                        name={focused ? "add" : "add-outline"}
                        size={28}
                        color={color}
                        style={{ alignSelf: 'center', marginTop: 10 }}
                    />
                ),
                headerShown: false,

            })}
        />
        <MainTab.Screen
            name='News'
            component={NewsScreen}
            options={{
                tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons
                        name={focused ? "newspaper" : "newspaper-outline"}
                        size={size}
                        color={color}
                        style={{ alignSelf: 'center', marginTop: 10 }}
                    />
                ),
                headerShown: false,
            }}
        />
        <MainTab.Screen
            name='Chats'
            component={Chats}
            options={{
                tabBarIcon: ({ focused, size, color }) => (
                    <Feather
                        name={focused ? "message-circle" : "message-circle"}
                        size={size}
                        color={color}
                        style={{ alignSelf: 'center', marginTop: 10 }}
                    />
                ),
                headerShown: false,
            }}
        />


        <MainTab.Screen
            name='Profile'
            component={ProfileScreen}
            options={{
                tabBarIcon: ({ focused, size, color }) => (
                    <Feather
                        name={focused ? "user" : "user"}
                        size={size}
                        color={color}
                        style={{ alignSelf: 'center', marginTop: 10 }}
                    />
                ),
                headerShown: false,
            }}
        />
    </MainTab.Navigator>
)
