import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './app/componets/Home/Home';
import { Reports } from './app/componets/Reports/Reports';
import { Workout } from './app/componets/Workout/Workout';
import { WorkoutHistory } from './app/componets/Workout/WorkoutHistory';
import appSql from './app/controllers/app.controller';
import FlashMessage from "react-native-flash-message";
import { useEffect } from 'react'
import { StatusBar } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import * as Colors from './app/config/colors'

import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

//https://reactnavigation.org/docs/native-stack-navigator/#options
export default function App() {
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // await appSql.dropTable('cardioWorkouts')
        // await appSql.dropAllTables();
        // await appSql.getTablesFromDB();

        await appSql.createTables();
        await appSql.checkTable('strengthWorkoutSummary')

      } catch (error) {
        console.error(error)
      }
    };

    fetchData();
  }, []);

  const headerOptions = {
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerTintColor: Colors.white,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };


  function WorkoutStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="WorkoutScreen"
          component={Workout}
          options={{
            ...headerOptions,
            tabBarIcon: ({ color, size }) => (
              <AntIcon name='linechart' size={20} color={color} />
            ),
          }}
        />
        <Stack.Screen
          name="WorkoutHistory"
          component={WorkoutHistory}
          options={{
            ...headerOptions,
            tabBarIcon: ({ color, size }) => (
              <AntIcon name='linechart' size={20} color={color} />
            ),
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primary} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: Colors.highlight,
            tabBarActiveBackgroundColor: Colors.primary,
            tabBarInactiveTintColor: Colors.white,
            tabBarInactiveBackgroundColor: Colors.primary,
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={Home} 
            options={{
              ...headerOptions,
              tabBarIcon: ({ color, size }) => (
                <IonIcon name='home-outline' size={20} color={color} />
              ),
            }}

          />
          <Tab.Screen 
            name="Reports" 
            component={Reports}
            options={{
              ...headerOptions,
              tabBarIcon: ({ color, size }) => (
                <AntIcon name='linechart' size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Workout" 
            component={WorkoutStack}
            options={{
              ...headerOptions,
                headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <FontIcon name='dumbbell' size={20} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
        <FlashMessage position="bottom" />
      </NavigationContainer>
    </>
  );
}