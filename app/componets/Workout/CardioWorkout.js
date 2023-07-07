import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const CardioWorkout = ({navigation, setPageMode, workout}) => {

  useEffect(() => {
    navigation.setOptions({ headerTitle: 'Cardio - ' + workout.name });
  }, [])

  return (
    <>
      <View>
        <Pressable 
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

});