import { StyleSheet, Text, View, Button } from 'react-native';
import SwitchSelector from "react-native-switch-selector";

import * as Colors from '../../config/colors'

export const Workout = ({navigation}) => {


  const options = [
    { label: "Strength", value: "strengthMode" },
    { label: "Cardio", value: "cardioMode" },
  ];


  return (
    <>
      <View style={styles.background} >
        <View style={styles.homeContainer}>
          <Text>Minor Total Summary</Text>
        </View>
        
        <SwitchSelector
          options={options}
          initial={0}
          onPress={value => console.log(`Call onPress with value: ${value}`)}
          textColor={Colors.primary}
          selectedColor={Colors.white}
          buttonColor={Colors.primary}
          borderColor={Colors.primary}
        />

        <View style={styles.homeContainer}>
          <Text>Select Routine</Text>
        </View>

        <Text>edit workouts...</Text>
        <View style={styles.homeContainer}>
          <Text>List of workouts</Text>
        </View>

        <Button
          title="Start Workout"
          onPress={() =>
            console.log('Start')
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  background: {
    backgroundColor: Colors.white,
  }
});
