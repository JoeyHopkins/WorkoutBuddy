import { StyleSheet, Text, View, Button, Dimensions, Pressable} from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import React, {useState, useEffect} from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import * as Colors from '../../config/colors'
import Carousel from 'react-native-snap-carousel';
import * as homeSql from '../../controllers/home.controller'
import { Wander } from 'react-native-animated-spinkit'
import { EditWorkout } from './EditWorkout'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const slideWidth = width * 0.8 - 40;
const slideHeight = height * 0.22;

export const Workout = ({navigation}) => {

  const [workoutMode, setWorkoutMode] = useState("strengthMode");
  const [pageMode, setPageMode] = useState("Main");
  const [loading, setLoading] = useState(true);
  const [routineList, setRoutineList] = useState([])

  const options = [
    { label: "Strength", value: "strengthMode" },
    { label: "Cardio", value: "cardioMode" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await getData()
        setLoading(false)
      } catch (error) {
        // showMessage({
        //   message: 'Error',
        //   description: 'There was an error.',
        //   type: "danger",
        // });
        console.error(error)
      }
    }
    fetchData()
  }, [])

  async function getData() {
    let routinesList = await homeSql.getAllRoutinesList()
    setRoutineList(routinesList)  
  }

  renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{ item.routine }</Text>
        <Text style={styles.previousWorkoutContainer}>No previous workout...</Text>
      </View>
    );
  }

  const handleSnapToItem = (slideIndex) => {
    console.log('Slide index:', slideIndex);
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

  const Main = () => {
    return (
      <>
        <View style={styles.fillSpace}>
          <View style={styles.homeContainer}>
            <View>
              <Text style={styles.title}>Weekly Total Summary</Text>
            </View>
            <View style={styles.totalContainer}>
              {workoutMode === 'strengthMode' && (
                <StrengthTotals/>
              )}
              
              {workoutMode === 'cardioMode' && (
                <CardioTotals/>
              )}
            </View>
          </View>

          <View style={styles.modeSwitchContainer}>
            <SwitchSelector
              options={options}
              initial={0}
              onPress={value => setWorkoutMode(value)}
              textColor={Colors.primary}
              selectedColor={Colors.white}
              buttonColor={Colors.primary}
              borderColor={Colors.primary}
            />
          </View>
        </View>


        <View style={styles.homeContainer}>

          {loading == true && (
            <Wander size={48} color={Colors.primary} />
          )}

          {loading == false && routineList && routineList.length > 0 && (

            <Carousel
              data={routineList}
              firstItem={routineList.length - 1}
              activeSlideOffset={5}
              lockScrollTimeoutDuration={2000}
              renderItem={renderItem}
              sliderWidth={width - 40}
              itemWidth={slideWidth}
              layout={'stack'} layoutCardOffset={18}
              onSnapToItem={handleSnapToItem}
              style={styles.carousel}
            />
          )}
          
          {routineList.length == 0 && loading == false && (
            <View style={styles.center}>
              <Text style={styles.center}>You have no routines...</Text>
            </View>
          )}

        </View>

        <View style={styles.homeContainer}>
          <View style={styles.editButtonContainer}>
            <Pressable
              style={styles.circleButton}
              onPress={() => { setPageMode('Edit') }}
            >
              <EntypoIcon name='edit' size={20} color={Colors.black} />
            </Pressable>
          </View>
          <View style={styles.center}>
            <Text>You have no workouts...</Text>
          </View>

        </View>

        <Pressable 
          onPress={() => { console.log('Start') }}
          style={styles.startWorkoutButton}
        >
          <Text>Start Workout</Text>
        </Pressable>      
      </>
    )
  }

  return (
    <>
      <View style={styles.background}>

        {pageMode == 'Main' && (
          <Main></Main>
        )}

        {pageMode == 'Edit' && (
          // <Text>Edit Mode</Text>
          <EditWorkout></EditWorkout>
        )}        
     
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
    paddingTop: 20,
    marginHorizontal: 20,
    borderColor: Colors.primary,
    overflow: 'hidden',
    flex: 1,
  },
  homeContainerCenter: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    paddingTop: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primary,
    overflow: 'hidden',
    flex: 1,
  },
  background: {
    backgroundColor: Colors.white,
    flex: 1,
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
    width: slideWidth,
    height: slideHeight,
    borderWidth: 10,
    borderRadius: 20,    
    alignItems: 'center',
    marginVertical: 0,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previousWorkoutContainer: {
    color: Colors.primary,
    fontSize: 16,
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fillSpace: {
    flex: 1,
  },
  startWorkoutButton: {
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
});
