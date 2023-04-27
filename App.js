import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Reports } from './app/componets/Reports/Reports';
import { Workout } from './app/componets/Workout/Workout';
import { Planning } from './app/componets/Planning/Planning';
import { useState, useEffect } from 'react'
import * as SQLite from 'expo-sqlite'

const Tab = createBottomTabNavigator();
const db = SQLite.openDatabase('workouBuddy.db');

fetchData = () => {
  db.transaction(tx => {
    // sending 4 arguments in executeSql
    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", null, 
      // success callback which sends two things Transaction object and ResultSet Object
      (txObj, { rows: { _array } }) => console.log(_array),
      // failure callback which sends two things Transaction object and Error
      (txObj, error) => console.log('Error ', error)
      ) // end executeSQL
  }) // end transaction
}

//https://reactnavigation.org/docs/native-stack-navigator/#options
export default function App() {

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))`,
        [],
        (sqlTxn, res) => {
          console.log("Table created successfully")
          // print off tables in db
          // this.fetchData() 
        },
        error => {
          console.log("error creating table " + error.message)
        }
      )
    });
  };

  useEffect( () => {
    createTables();
  }, [])

  console.log('app started')
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