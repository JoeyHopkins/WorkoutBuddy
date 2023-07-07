import { StyleSheet, Text, View, Dimensions, Pressable, ScrollView} from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import React, {useState, useEffect, useRef, memo} from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import * as Colors from '../../config/colors'
import Carousel from 'react-native-snap-carousel';
import * as workoutSql from '../../controllers/workouts.controller'
import * as homeSql from '../../controllers/home.controller'
import { Wander } from 'react-native-animated-spinkit'
import { EditWorkout } from './EditWorkout'
import { CardioWorkout } from './CardioWorkout'
import { useNavigation } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const width = Dimensions.get('window').width;
const slideWidth = width * 0.8 - 0;

const options = [
  { label: "Strength", value: "strength" },
  { label: "Cardio", value: "cardio" },
];

export const Workout = ({navigation}) => {

  const [workoutMode, setWorkoutMode] = useState("strength");
  const [pageMode, setPageMode] = useState("Main");
  const [loading, setLoading] = useState(true);
  const [routineList, setRoutineList] = useState([])
  const [workoutList, setWorkoutList] = useState([])
  const [selectedWorkouts, setSelectedWorkouts] = useState([])

  let routineSelected = useRef({})
  let routineSelectedID = useRef(-1)

  let cardioWorkouts = useRef([])
  
  let refresh = useRef(true)

  //handle header between the pages
  React.useLayoutEffect(() => {
    if(pageMode === "Workout" || pageMode === "Edit")
      navigation.setOptions({
        headerLeft: () => <CustomHeader />,
      });
    else if (pageMode === "Main") 
      navigation.setOptions({
        headerLeft: undefined,
      });
    
  }, [pageMode]);

  const CustomHeader = () => {
    const navigation = useNavigation();
  
    const handleBackButton = () => {
      setPageMode('Main') 
      navigation.setOptions({headerTitle: 'Workout'});
    };
  
    return (
      <Pressable style={styles.headerButton} onPress={handleBackButton}>
        <IonIcon name="md-chevron-back" size={20} color={Colors.white} />
      </Pressable>
    );
  }
    

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await getData()
      setLoading(false)
    }

    if(pageMode === "Main" && refresh.current) {
      fetchData()
      refresh.current = true
    }
 
  }, [pageMode])

  function changeWorkoutMode(value) {
    setWorkoutMode(value)
    setSelectedWorkouts([])

    if(value === "strength")
    {
      setWorkoutList(routineSelected.current.workouts)
      styles.workoutRecord.marginLeft = -90;
    }
    else if(value === "cardio") 
    {
      setWorkoutList(cardioWorkouts.current)
      styles.workoutRecord.marginLeft = -40;
    }
  }

  async function getData() {
    try {
      let routinesList = await homeSql.getAllRoutinesList()
      let strengthWorkoutList = await workoutSql.getAllStrengthWorkouts()
      cardioWorkouts.current = await workoutSql.getAllCardioWorkouts()

      for(let i in routinesList) {
        if(routinesList[i].workouts === undefined)
          routinesList[i].workouts = []

        for(let workout of strengthWorkoutList)
          if(workout.routineId === routinesList[i].id)
            routinesList[i].workouts.push(workout)
      }

      if(routineSelectedID.current == -1) {
        routineSelected.current = routinesList[routinesList.length - 1]
        routineSelectedID.current = routinesList.length - 1      
      } 

      if(workoutMode === "strength")
        setRoutineList(routinesList)
      if(workoutMode === "cardio")
        setWorkoutList(cardioWorkouts.current)

    } catch (error) {
      console.error(error)
    }
  }

  function addOrRemoveSelectedWorkout(workout) {

    let selected = []
    let workoutExists = false;

    if(workoutMode === "strength") {

      for (let activity of selectedWorkouts) {
        if (activity.routineId === routineSelected.current.id) {
          selected.push(activity);

          if (activity === workout) 
            workoutExists = true;
        }
      }
      
      if (!workoutExists)
        selected.push(workout);
      else
        selected = selected.filter(activity => activity !== workout);

      setSelectedWorkouts(selected);
    }
    else if(workoutMode === "cardio") {
      selected.push(workout);
      setSelectedWorkouts(selected)
    }
  }

  const CardioWorkoutRecord = ({workout}) => {
    return (
      <View style={styles.workoutRecordContainer}>      
        <Pressable
          onPress={() => { 
            addOrRemoveSelectedWorkout(workout)
          }}
          style={selectedWorkouts.some(item => item === workout) ? [styles.selected, styles.workoutRecord] : styles.workoutRecord}
        >
          <Text>{workout.name}</Text>
        </Pressable>
      </View>
    )
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{ item.routine }</Text>
        {loading == false && item.workouts.length == 0 && (
          <View style={styles.center}>
            <Text>You have no workouts...</Text>
          </View>
        )}
        {loading == false && item.workouts.length > 0 && (
          <View style={styles.strengthWorkoutListContainer}>
            <ScrollView>
              {item.workouts.map((workout, index) => (
                <CardioWorkoutRecord key={index} workout={workout} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }

  function handleSnapToItem(slideIndex) {
    routineSelected.current = routineList[slideIndex]
    routineSelectedID.current = slideIndex
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
        <View style={styles.homeContainer}>
          <View>
            <Text style={styles.title}>Weekly Total Summary</Text>
          </View>
          <View style={styles.totalContainer}>
            {workoutMode === 'strength' && (
              <StrengthTotals/>
            )}
            {workoutMode === 'cardio' && (
              <CardioTotals/>
            )}
          </View>
        </View>
        <View style={styles.modeSwitchContainer}>
          <SwitchSelector
            options={options}
            initial={workoutMode === "strength" ? 0 : 1}
            onPress={value => changeWorkoutMode(value)}
            textColor={Colors.primary}
            selectedColor={Colors.white}
            buttonColor={Colors.primary}
            borderColor={Colors.primary}
          />
        </View>

        {workoutMode == 'strength' && (
          <View style={styles.routineListContainer}>
            <View style={styles.editButtonContainer}>
              <Pressable
                style={styles.circleButton}
                onPress={() => { setPageMode('Edit') }}
              >
                <EntypoIcon name='edit' size={20} color={Colors.black} />
              </Pressable>
            </View>
            {loading == true && (
              <Wander size={48} color={Colors.primary} />
            )}
            {loading == false && routineList && routineList.length > 0 && (
              <Carousel
                data={routineList}
                firstItem={routineSelectedID.current}
                activeSlideOffset={5}
                lockScrollTimeoutDuration={2000}
                renderItem={renderItem}
                sliderWidth={width - 40}
                itemWidth={slideWidth}
                layout={'stack'} 
                layoutCardOffset={5}
                onSnapToItem={handleSnapToItem}
              />
            )}
            {routineList.length == 0 && loading == false && (
              <View style={styles.center}>
                <Text>You have no routines...</Text>
              </View>
            )}
          </View>
        )}

        {workoutMode == 'cardio' && (
          <View style={[styles.homeContainer, styles.fillSpace]}>
            <View style={styles.editButtonContainer}>
              <Pressable
                style={styles.circleButton}
                onPress={() => { setPageMode('Edit') }}
              >
                <EntypoIcon name='edit' size={20} color={Colors.black} />
              </Pressable>
            </View>
            <ScrollView>
              {workoutList.map((workout, index) => (
                <CardioWorkoutRecord key={index} workout={workout} />
              ))}
            </ScrollView>    
          </View>
        )}

        <Pressable 
          onPress={() => { 
            refresh.current = false;
            setPageMode('Workout') 
          }}
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
          <EditWorkout 
            workoutMode={workoutMode} 
            setPageMode={setPageMode} 
            routineSelected={routineSelected}
            navigation={navigation}
          ></EditWorkout>
        )}
        {pageMode == 'Workout' && (
          <>
            {workoutMode == 'strength' && (
              <Text>strength</Text>
            )}
            {workoutMode == 'cardio' && (
              <CardioWorkout
                navigation={navigation}
                setPageMode={setPageMode}
                workout={selectedWorkouts[0]}
              ></CardioWorkout>
            )}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  workoutRecordContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    marginTop: 1,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  workoutRecord: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: -90,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    marginHorizontal: 20,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  fillSpace: {
    flex: 1,
  },
  routineListContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    marginHorizontal: 20,
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
    paddingBottom: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  modeSwitchContainer: {
    marginHorizontal: 20,
    paddingTop: 10,
  },
  slide: {
    flex: 1,
    width: width - 80,
    borderWidth: 3,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: -3,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
  },
  strengthWorkoutListContainer: {
    backgroundColor: Colors.background,
    marginBottom: 20,
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
    paddingVertical: 20,
    marginBottom: 0,
  },
  headerButton: {
    marginLeft: 10,
    marginRight: -10,
  },
});