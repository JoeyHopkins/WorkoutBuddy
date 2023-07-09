import { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import * as Colors from "../../config/colors";
import React from "react";
import { showMessage } from "react-native-flash-message";

import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";

import * as sqlCardio from "../../controllers/cardioWorkouts.controller";

const { width, height } = Dimensions.get("window");

export const CardioWorkout = ({ navigation, setPageMode, workout }) => {
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [intensity, setIntensity] = useState(0);
  const [distance, setDistance] = useState(0);

  const milliseconds = elapsedTime % 1000;
  const seconds = (elapsedTime / 1000) % 60;
  const minutes = (elapsedTime / (1000 * 60)) % 60;
  const hours = (elapsedTime / (1000 * 60 * 60)) % 24;
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled((prevIsToggled) => !prevIsToggled);
  };

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
    navigation.setOptions({ headerTitle: "Cardio - " + workout.name });
  }, []);

  const manuallyChangeTime = (isUp, type, durationMultiplier) => {
  
    let multiplier = isUp ? 1 : -1;
    let value = 0;

    switch (type) {
      case "H":
        value = multiplier * 3600000 * durationMultiplier; // 1 hour = 3600000 milliseconds
        setElapsedTime((prevElapsedTime) => prevElapsedTime + value);
        break;
      case "M":
        value = multiplier * 60000 * durationMultiplier; // 1 minute = 60000 milliseconds
        setElapsedTime((prevElapsedTime) => prevElapsedTime + value);
        break;
      case "S":
        value = multiplier * 1000 * durationMultiplier; // 1 second = 1000 milliseconds
        setElapsedTime((prevElapsedTime) => prevElapsedTime + value);
        break;
      case "ms":
        value = multiplier * 10 * durationMultiplier; // 10 milliseconds
        setElapsedTime((prevElapsedTime) => prevElapsedTime + value);
        break;
      default:
        break;
    }

    if(elapsedTime + value > 0)
      setDisableSubmit(false);
    else
      setDisableSubmit(true);
  };

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

  const resetStopwatch = () => {
    setStartTime(0);
    setElapsedTime(0);
    setIsRunning(false);
    setDisableSubmit(true);
  };

  const changeIntensity = () => {
    setIntensity((prevIntensity) =>
      prevIntensity === 3 ? 1 : prevIntensity + 1
    );
  };

  function goBackToWorkouts() {
    setPageMode("Main");
    navigation.setOptions({ headerTitle: "Workout" });
  }

  const formatTime = (time) => {
    const paddedTime = Math.floor(time).toString().padStart(2, "0");
    return paddedTime;
  };

  const onInputChange = (number) => {
    setDistance(number);
  };

  const getCurrentDateTimeInUserTimezone = () => {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset();
    const offsetInMilliseconds = timezoneOffset * 60 * 1000;
    const localTime = date.getTime() - offsetInMilliseconds;
    const userDateTime = new Date(localTime);
    return (isoString = userDateTime.toISOString());
  };

  const submitCardioWorkout = async () => {
    let duration = elapsedTime / 1000;
    let now = getCurrentDateTimeInUserTimezone();

    try {
      if (intensity === 0) {
        showMessage({
          message: "Error",
          description: "Please select an intensity",
          type: "danger",
        });
        return;
      }
      if (workout.trackDistance == true && distance === 0) {
        showMessage({
          message: "Error",
          description: "Please enter a distance",
          type: "danger",
        });
        return;
      }

      if (workout.trackDistance == false)
        await sqlCardio.insertL1CardioWorkout(
          workout.id,
          duration,
          intensity,
          now
        );
      else
        await sqlCardio.insertL2CardioWorkout(
          workout.id,
          duration,
          intensity,
          now,
          distance
        );

      showMessage({
        message: "Success",
        description: "Submitted successfully",
        type: "success",
      });
      goBackToWorkouts();
    } catch (error) {
      showMessage({
        message: "Error",
        description: "There was an error",
        type: "danger",
      });
    }
  };

  return (
    <>
      <View style={[styles.fillSpace, styles.center]}>
        <View style={styles.timerContainer}>
          {workout.trackDistance == true && (
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Distance"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  textAlign="center"
                  onChangeText={onInputChange}
                />
              </View>
              <Text style={styles.distanceText}>Miles</Text>
            </View>
          )}

          <View style={styles.editableTimerContainer}>

            <View style={[styles.row, styles.topTimerEditButtons]}>
              <Pressable onPress={() => manuallyChangeTime(true, 'H', 1)} onLongPress={() => manuallyChangeTime(true, 'H', 5)}>
                <MatIcon name="chevron-up" size={50} color={isToggled ? Colors.primary : Colors.background} />
              </Pressable>
              <Pressable onPress={() => manuallyChangeTime(true, 'M', 1)} onLongPress={() => manuallyChangeTime(true, 'M', 10)}>
                <MatIcon name="chevron-up" size={50} color={isToggled ? Colors.primary : Colors.background} />
              </Pressable>
              <Pressable onPress={() => manuallyChangeTime(true, 'S', 1)} onLongPress={() => manuallyChangeTime(true, 'S', 10)}>
                <MatIcon name="chevron-up" size={50} color={isToggled ? Colors.primary : Colors.background} />
              </Pressable>
              <Pressable onPress={() => manuallyChangeTime(true, 'ms', 1)} onLongPress={() => manuallyChangeTime(true, 'ms', 10)}>
                <MatIcon name="chevron-up" size={50} color={isToggled ? Colors.primary : Colors.background} />
              </Pressable>
            </View>

            <Text style={styles.timer}>
              {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}:
              {formatTime(Math.floor(milliseconds / 10))}
            </Text>

            <View style={[styles.row, styles.topTimerEditButtons]}>
              <Pressable onPress={() => manuallyChangeTime(false,'H', 1)} onLongPress={() => manuallyChangeTime(false,'H', 5)}>
                <MatIcon name="chevron-down" size={50} color={isToggled ? Colors.primary : Colors.background} />
              </Pressable>
              <Pressable onPress={() => manuallyChangeTime(false,'M', 1)} onLongPress={() => manuallyChangeTime(false,'M', 10)}>
                <MatIcon name="chevron-down" size={50} color={isToggled ? Colors.primary : Colors.background} />
              </Pressable>
              <Pressable onPress={() => manuallyChangeTime(false,'S', 1)} onLongPress={() => manuallyChangeTime(false,'S', 10)}>
                <MatIcon name="chevron-down" size={50} color={isToggled ? Colors.primary : Colors.background} />
              </Pressable>
              <Pressable onPress={() => manuallyChangeTime(false,'ms', 1)} onLongPress={() => manuallyChangeTime(false,'ms', 10)}>
                <MatIcon name="chevron-down" size={50} color={isToggled ? Colors.primary : Colors.background} />
              </Pressable>
            </View>

          </View>

          <Pressable onPress={handleToggle}>
            <MatIcon
              name="clock-edit-outline"
              size={50}
              color={isToggled ? Colors.primary : 'black'}
            />
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
          {intensity === 1 && " Low"}
          {intensity === 2 && " Medium"}
          {intensity === 3 && " High"}
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
          <Text>{isRunning ? "Stop" : "Start"}</Text>
        </Pressable>
      </View>

      <Pressable
        style={disableSubmit ? [styles.button, styles.disabled] : styles.button}
        disabled={disableSubmit}
        onPress={submitCardioWorkout}
      >
        <Text>Submit</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  topTimerEditButtons: {
    justifyContent: "space-between",
    // borderWidth: 1,
  },
  timer: {
    fontSize: 48,
    textAlign: 'center',
  },
  inputContainer: {
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    // marginLeft: 45,
    // marginRight: 10,
  },
  input: {
    fontSize: 14,
    color: "#333",
  },
  fillSpace: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  distanceText: {
    marginTop: 5,
    marginLeft: 10,
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
    justifyContent: "center",
    alignSelf: "center",
    // borderWidth: 4,
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: width * 0.5,
    borderColor: Colors.primary,
    backgroundColor: "white",
    width: width * 0.9,
    maxHeight: width * 0.9,
  },
  button: {
    paddingVertical: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  smallButton: {
    width: width * 0.42,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 20,
    alignItems: "center",
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
  },
});