import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'

import { RoutineChange, RoutineMain } from "./Routines"
import { ActivityTracker } from "./ActivityTracker"

import homeSql from '../../controllers/home.controller'

import styles from '../../config/styles'

const INITIAL_DATE = new Date().toISOString();

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

        <View style={[styles.homeContainer]}>
          <ActivityTracker></ActivityTracker>
        </View>

        <View style={styles.homeContainer}>
          <RoutineChange></RoutineChange>
        </View>
      </ScrollView>
    </>
  );
};
