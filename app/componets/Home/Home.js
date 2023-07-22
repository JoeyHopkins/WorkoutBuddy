import React, {useState, useEffect} from 'react';
import { ScrollView, View, Text, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'

import { RoutineChange, RoutineMain } from "./Routines"
import { ActivityTracker } from "./ActivityTracker"

import homeSql from '../../controllers/home.controller'

import styles from '../../config/styles'

const INITIAL_DATE = new Date().toISOString();

export const Home = ({navigation}) => {

  const [showRoutinesMain, setShowRoutinesMain] = useState(false)
  const [loading, setLoading] = useState(true)
  let routineList = []

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        routineList = await homeSql.getAllRoutines()
        
        if(routineList.length > 0)
          setShowRoutinesMain(true)
        else
          setShowRoutinesMain(false)
        
        setLoading(false)
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
          <View style={[styles.homeContainer, styles.marginTop_S, styles.paddingVertical_M]}>
            <RoutineMain></RoutineMain>
          </View>
        )}

        <View style={[[styles.homeContainer, styles.marginTop_S, styles.paddingVertical_M]]}>
          <ActivityTracker></ActivityTracker>
        </View>

        <View style={[styles.homeContainer, styles.marginVertical_S, styles.paddingVertical_M]}>
          <RoutineChange></RoutineChange>
        </View>
      </ScrollView>
    </>
  );
};