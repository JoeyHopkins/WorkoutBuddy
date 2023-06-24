import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './app/componets/Home/Home';
import { Reports } from './app/componets/Reports/Reports';
import { Workout } from './app/componets/Workout/Workout';
import { Planning } from './app/componets/Planning/Planning';
import appSql from './app/controllers/app.controller';
import FlashMessage from "react-native-flash-message";
import { useEffect } from 'react'
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

//https://reactnavigation.org/docs/native-stack-navigator/#options
export default function App() {
  
  useEffect( () => {
    // appSql.dropAllTables();
    appSql.createTables();
    appSql.getTablesFromDB();
  })
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#e91e63',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={Home} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <IonIcon name='home-outline' size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Reports" 
          component={Reports}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntIcon name='linechart' size={20} color={color} />
            ),
          }}
        />         
        <Tab.Screen 
          name="Workout" 
          component={Workout} 
        />
        <Tab.Screen 
          name="Planning" 
          component={Planning} 
        />
      </Tab.Navigator>
      <FlashMessage position="bottom" />
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