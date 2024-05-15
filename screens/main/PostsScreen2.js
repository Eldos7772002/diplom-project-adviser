import React from "react";
import { moduleName } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen2 from "../nestedScreen/Home/HomeScreen2";
import CommentsScreen from "../nestedScreen/CommentsScreen";
import MapScreen from "../nestedScreen/MapScreen";


const NestedScreen = createStackNavigator();

const PostsScreen2 = () => {
    return (
        <NestedScreen.Navigator>
            <NestedScreen.Screen
                name="Home"
                component={HomeScreen2}
                options={{
                    headerShown: false,
                }}
            />
            <NestedScreen.Screen name="Comments" component={CommentsScreen} />
            <NestedScreen.Screen name="Map" component={MapScreen}/>
        </NestedScreen.Navigator>
    );
};

export default PostsScreen2;
