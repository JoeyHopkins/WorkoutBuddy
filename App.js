import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

const Reports = ({navigation}) => {
  return (
    <Button
      title="Go to Workout Page"
      onPress={() =>
        navigation.navigate('Workout', {name: 'Jane'})
      }
    />
   );
};
    
const Workout = ({navigation}) => {
  return (
    <Button
      title="Go to Planning Page"
      onPress={() =>
        navigation.navigate('Planning', {name: 'Jane'})
      }
    />
  );
};

const Planning = ({navigation}) => {
  return (
    <Button
      title="Go to Reports Page"
      onPress={() =>
        navigation.navigate('Reports', {name: 'Jane'})
      }
    />
  );
};

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
