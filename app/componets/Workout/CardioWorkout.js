import { useEffect, useState, useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import * as Colors from '../../config/colors'
import React from'react';

import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';

import * as sqlCardio from '../../controllers/cardioWorkouts.controller';

const { width, height } = Dimensions.get('window');

export const CardioWorkout = ({navigation, setPageMode, workout}) => {

  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [intensity, setIntensity] = useState(0);
  
  const milliseconds = elapsedTime % 1000;
  const seconds = (elapsedTime / 1000) % 60;
  const minutes = (elapsedTime / (1000 * 60)) % 60;
  const hours = (elapsedTime / (1000 * 60 * 60)) % 24;

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        const now = performance.now();
        setElapsedTime(now - startTime);
      }, 10);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, startTime]);

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Cardio - ' + workout.name });
  }, [])


  const toggleStopwatch = () => {
    if (isRunning) {
      setIsRunning(false);
      setDisableSubmit(false);
    } else {
      const now = performance.now();
      setStartTime(now - elapsedTime);
      setIsRunning(true);
      setDisableSubmit(true);
    }
  };

  const getCurrentDateTimeInUserTimezone = () => {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset();
    const offsetInMilliseconds = timezoneOffset * 60 * 1000;
    const localTime = date.getTime() - offsetInMilliseconds;
    const userDateTime = new Date(localTime);
    return isoString = userDateTime.toISOString();
  };

  const submitCardioWorkout = () => {
    let duration = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}:${formatTime(Math.floor(milliseconds / 10))}`
    let now = getCurrentDateTimeInUserTimezone();

    //submit cardio workout
    // sql.submitBasicCardioWorkout(workout.id, duration, intensity, now)
  };

  const changeIntensity = () => {
    setIntensity(prevIntensity => (prevIntensity === 3 ? 1 : prevIntensity + 1));
  };

  const resetStopwatch = () => {
    setStartTime(0);
    setElapsedTime(0);
    setIsRunning(false);
    setDisableSubmit(true);
  };

  const formatTime = (time) => {
    const paddedTime = Math.floor(time).toString().padStart(2, '0');
    return paddedTime;
  };

  return (
    <>

      <View style={[styles.center, styles.fillSpace]}>
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>
            {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}:
            {formatTime(Math.floor(milliseconds / 10))}
          </Text>

          <Pressable 
            onPress={resetStopwatch}
          >
            <MatIcon name="clock-edit-outline" size={50} color={Colors.primary} />
          </Pressable>

        </View>
      </View>

      <Pressable
        style={[
          styles.button,
          intensity === 1 && styles.buttonLow,
          intensity === 2 && styles.buttonMedium,
          intensity === 3 && styles.stopButton,
        ]}
        onPress={changeIntensity}
      >
        <Text>
          Intensity:
          {intensity === 1 && ' Low'}
          {intensity === 2 && ' Medium'}
          {intensity === 3 && ' High'}
        </Text>
      </Pressable>

      <View style={styles.row}>
        <Pressable 
          style={[styles.smallButton, styles.marginLeft]}
          onPress={resetStopwatch}
          >
            <Text>Reset</Text>
        </Pressable>

        <Pressable
          style={[
            styles.smallButton,
            styles.marginRight,
            isRunning ? styles.stopButton : null,
          ]}
          onPress={toggleStopwatch}
        >
          <Text>{isRunning ? 'Stop' : 'Start'}</Text>
        </Pressable>
      </View>

      <Pressable 
        style={disableSubmit ? [styles.button, styles.disabled] : styles.button }
        disabled={disableSubmit}
        onPress={submitCardioWorkout}
        >
          <Text>Submit</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  fillSpace: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  orText: {
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    marginBottom: 20,
    marginTop: 80,
  },
  buttonLow: {
    backgroundColor: Colors.green,
  },
  buttonMedium: {
    backgroundColor: Colors.yellow,
  },
  stopButton: {
    backgroundColor: Colors.red,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    height: 4 * width / 5,
    width: 4 * width / 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 4 * width / 10,
    borderColor: Colors.primary,
    backgroundColor: 'white',
    margin: 40
  },
  button: {
    paddingVertical: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  smallButton: {
    width: width * .42,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  marginLeft: {
    marginLeft: 20, 
  },
  marginRight: {
    marginRight: 20, 
  },
  disabled: {
    backgroundColor: Colors.backgroundGray,
  }
});