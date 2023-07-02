import { StyleSheet, Text, View, Button } from 'react-native';
import SwitchSelector from "react-native-switch-selector";

import * as Colors from '../../config/colors'
import { useState } from 'react';

import Carousel from 'react-native-snap-carousel';

export const Workout = ({navigation}) => {

  const [pageMode, setPageMode] = useState("strengthMode");

  const options = [
    { label: "Strength", value: "strengthMode" },
    { label: "Cardio", value: "cardioMode" },
  ];

  const data = [
    { id: 1, date: '2023-07-01', activity: 'Activity 1', type: 'type1' },
    { id: 2, date: '2023-07-02', activity: 'Activity 2', type: 'type2' },
    { id: 3, date: '2023-07-03', activity: 'Activity 3', type: 'type3' },
  ];

  renderItem = ({item, index}) => {
    return (
        <View style={styles.slide}>
            <Text style={styles.title}>{ item.activity }</Text>
        </View>
    );
  }

  const handleSnapToItem = (slideIndex) => {
    console.log('Slide index:', slideIndex);
    // Perform any desired actions based on the slide index
  };


  const StrengthTotals = () => {
    return (
      <>
        <View style={styles.totalItem}>
          <Text>Reps</Text>
          <Text>0</Text>
        </View>

        <View style={styles.totalItem}>
          <Text>Weight</Text>
          <Text>0 lbs</Text>
        </View>

        <View style={styles.totalItem}>
          <Text>Avg</Text>
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
            <Text>Weekly Total Summary</Text>
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

        <View style={styles.modeSwitchContainer}>
          <SwitchSelector
            options={options}
            initial={0}
            onPress={value => setPageMode(value)}
            textColor={Colors.primary}
            selectedColor={Colors.white}
            buttonColor={Colors.primary}
            borderColor={Colors.primary}
          />
        </View>


        <View style={styles.homeContainer}>
          {/* <Text>You have no routines...</Text> */}
          <Carousel
              data={data}
              firstItem={data.length - 1}
              activeSlideOffset={5}
              lockScrollTimeoutDuration={2000}
              renderItem={renderItem}
              sliderWidth={800}
              itemWidth={200}
              layout={'stack'} layoutCardOffset={18}
              onSnapToItem={handleSnapToItem}
              // loop={true}
            />

        </View>

        <Text>edit workouts...</Text>
        <View style={styles.homeContainer}>
          <Text>You have no workouts...</Text>
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
    marginTop: 10,
    paddingVertical: 10,
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
    marginTop: 10,
  },
  modeSwitchContainer: {
    marginHorizontal: 20,
    paddingTop: 10,
  },
  slide: {
    width: 200,
    height: 200,
    borderWidth: 10,
    borderRadius: 20,    marginVertical: 0,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
});
