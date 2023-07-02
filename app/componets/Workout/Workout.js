import { StyleSheet, Text, View, Button } from 'react-native';
import SwitchSelector from "react-native-switch-selector";

import * as Colors from '../../config/colors'
import { useState } from 'react';

export const Workout = ({navigation}) => {

  const [pageMode, setPageMode] = useState("strengthMode");

  const options = [
    { label: "Strength", value: "strengthMode" },
    { label: "Cardio", value: "cardioMode" },
  ];


  const StrengthTotals = () => {
    return (
      <>
        <View style={styles.totalItem}>
          <Text># of Reps</Text>
          <Text>0</Text>
        </View>

        <View style={styles.totalItem}>
          <Text>Total Weight</Text>
          <Text>0 lbs</Text>
        </View>

        <View style={styles.totalItem}>
          <Text>Avg per Rep</Text>
          <Text>0 lbs</Text>
        </View>      
      </>
    ) 
  };

  const CardioTotals = () => {
    return (
      <>
        <View style={styles.totalItem}>
          <Text>Low</Text>
          <Text>0 minutes</Text>
        </View>

        <View style={styles.totalItem}>
          <Text>Medium</Text>
          <Text>0 minutes</Text>
        </View>

        <View style={styles.totalItem}>
          <Text>High</Text>
          <Text>0 minutes</Text>
        </View>      
      </>
    ) 
  };

  return (
    <>
      <View style={styles.background} >
        <View style={styles.homeContainer}>
          <View>
            <Text>Weekly Summary</Text>
          </View>
          <View style={styles.totalContainer}>
            {pageMode === 'strengthMode' && (
              <StrengthTotals/>
            )}
            
            {pageMode === 'cardioMode' && (
              <CardioTotals/>
            )}
          </View>
        </View>
        
        <SwitchSelector
          options={options}
          initial={0}
          onPress={value => setPageMode(value)}
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
  },
  totalItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,

  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginTop: 20,
  }
});
