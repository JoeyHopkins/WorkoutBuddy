import React, {useState, useEffect} from 'react';
import { ScrollView, View, Text, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'

import { RoutineChange, RoutineMain } from "./Routines"
import { ActivityTracker } from "./ActivityTracker"

import homeSql from '../../controllers/home.controller'

import styles from '../../config/styles'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { Settings } from './Settings'
import IonIcon from 'react-native-vector-icons/Ionicons';

const INITIAL_DATE = new Date().toISOString();

export const Home = ({navigation}) => {

  const [pageMode, setPageMode] = useState("Main");

  const [refreshComponet, setRefreshComponet] = useState(false)

  const [todaysRoutine, setTodaysRoutine] = useState(null);

  //handle header between the pages
  React.useLayoutEffect(() => {
    if(pageMode === "Settings") {
      navigation.setOptions({
        headerLeft: () => <SettingsPageHeader/>,
        headerRight: undefined
      });
    }
    else if (pageMode === "Main") {
      navigation.setOptions({
        headerLeft: undefined,
        headerRight: () => <GoToSettingsIcon/>
      });
    }
  }, [pageMode]);

  useFocusEffect(
    React.useCallback(() => {
      setRefreshComponet(true)
    }, [])
  );


  const SettingsPageHeader = () => {
    const navigation = useNavigation();
    
    const handleBackButton = () => {
      setPageMode('Main') 
      navigation.setOptions({headerTitle: 'Home'});
    };
  
    return (
      <>
        <View style={styles.row}>
          <Pressable style={styles.headerButton} onPress={handleBackButton}>
            <IonIcon name="md-chevron-back" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </>
    );
  }

  const GoToSettingsIcon = () => {

    const navigation = useNavigation();
  
    const handleSettingsButton = () => {
      setPageMode('Settings') 
      navigation.setOptions({headerTitle: 'Settings'});
    };

    return (
      <>
        <View style={styles.row}>
          <Pressable style={[styles.headerEditButton, styles.leftBorder]} onPress={handleSettingsButton}>
            <SimpleIcon name="settings" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <>
      {pageMode == 'Main' && (
        <ScrollView style={styles.background}>
          <View style={[styles.homeContainer, styles.marginTop_S, styles.paddingVertical_M]}>
            <RoutineMain 
              setRefreshComponet={setRefreshComponet} 
              refreshComponet={refreshComponet} 
              navigation={navigation}
              todaysRoutine={todaysRoutine}
              setTodaysRoutine={setTodaysRoutine}
            ></RoutineMain>
          </View>

          <View style={[[styles.homeContainer, styles.marginTop_S, styles.paddingVertical_M]]}>
            <ActivityTracker></ActivityTracker>
          </View>

          <View style={[styles.homeContainer, styles.marginVertical_S, styles.paddingVertical_M]}>
            <RoutineChange todaysRoutine={todaysRoutine} setRefreshComponet={setRefreshComponet}></RoutineChange>
          </View>
        </ScrollView>
      )}
      {pageMode == 'Settings' && (
        <Settings></Settings>
      )}      
    </>
  );
};