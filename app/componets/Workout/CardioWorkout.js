import { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Colors from '../../config/colors'

const { width, height } = Dimensions.get('window');

export const CardioWorkout = ({navigation, setPageMode, workout}) => {

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Cardio - ' + workout.name });
  }, [])

  return (
    <>
      <View>
        <View style={styles.center}>
          <View style={styles.timerContainer}>
            <Text>Timer</Text>
          </View>
        </View>

        <Pressable 
          style={styles.button}
          onPress={() => { 
            console.log('Hit Start');
          }}
          >
            <Text>Start</Text>
        </Pressable>

        <Pressable 
          style={[styles.button]}
          onPress={() => { 
            setPageMode('Main') 
            navigation.setOptions({headerTitle: 'Workout'});
          }}
          >
            <Text>Exit</Text>
        </Pressable>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  fillSpace: {
    flex: 1,
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
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
});