import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'

import { RoutineChange, RoutineMain } from "./Routines"
import homeSql from '../../controllers/home.controller'

export const Home = ({navigation}) => {

  const [showRoutinesMain, setShowRoutinesMain] = useState(false)
  const [routineList, setRoutineList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let message = await homeSql.getAllRoutines(setRoutineList)
        if(parseInt(message) > 0)
          setShowRoutinesMain(true)
        else
          setShowRoutinesMain(false)
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <ScrollView style={styles.background}>
        {showRoutinesMain && (
          <View style={styles.homeContainer}>
            <RoutineMain></RoutineMain>
          </View>
        )}

        <View style={styles.homeContainer}>
          <Text style={styles.homeContainerTitle}>Progress</Text>
        </View>

        <View style={styles.homeContainer}>
          <RoutineChange></RoutineChange>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  homeContainerTitle: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  background: {
    backgroundColor: Colors.background,
  },
  button: {
    width: 150,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center', 
  },
});