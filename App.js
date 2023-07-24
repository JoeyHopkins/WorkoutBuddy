import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './app/componets/Home/Home';
import { Reports } from './app/componets/Reports/Reports';
import { Workout } from './app/componets/Workout/Workout';
import appSql from './app/controllers/app.controller';
import FlashMessage from "react-native-flash-message";
import { useEffect } from 'react'
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import * as Colors from './app/config/colors'

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
        await appSql.checkTable('strengthBestRecords')

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

  return (
    <>
      {/* <StatusBar backgroundColor="black"  /> */}
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
            component={Workout}
            options={{
              ...headerOptions,
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