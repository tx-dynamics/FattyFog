import * as React from 'react';
import { Image, ImagePickerIOS, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './App/Home'
import SavedRecipies from './App/SavedRecipies'
import CreateNewRecipie from './App/CreateNewRecipie'
import EditRecipie from './App/EditRecipie'
import Login from './App/Login'
import FlovourAdd from './App/FlovourAdd'

import Constants from 'expo-constants'
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
const Drawer = createDrawerNavigator();
const MainStack = createStackNavigator();


const Main = () => {
  return (
    <MainStack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false, gestureEnabled: false }} >
      <MainStack.Screen name="Home" component={Home} />
      <MainStack.Screen name="SavedRecipies" component={SavedRecipies} />
      <MainStack.Screen name="CreateNewRecipie" component={CreateNewRecipie} />
      <MainStack.Screen name="EditRecipie" component={EditRecipie} />
      <MainStack.Screen name="Login" component={Login} />
      <MainStack.Screen name="FlovourAdd" component={FlovourAdd} />
    </MainStack.Navigator>
  );

}

Main.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.key > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Main"
        edgeWidth={0}
        statusBarAnimation={'slide'}
        hideStatusBar={false}
        drawerStyle={{
          backgroundColor: '#fff',
          width: responsiveWidth(70),
          borderTopRightRadius: 5,
        }}>

        <Drawer.Screen name="Main" component={Main} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
