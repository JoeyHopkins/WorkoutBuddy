import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Reports } from './app/componets/Reports/Reports';
import { Workout } from './app/componets/Workout/Workout';
import { Planning } from './app/componets/Planning/Planning';

const Tab = createBottomTabNavigator();

//https://reactnavigation.org/docs/native-stack-navigator/#options
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Reports" component={Reports} />
        <Tab.Screen name="Workout" component={Workout} />
        <Tab.Screen name="Planning" component={Planning} />
      </Tab.Navigator>
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