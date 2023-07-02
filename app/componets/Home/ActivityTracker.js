import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as activitiesSQL from '../../controllers/activities.controller'
import { Wander } from 'react-native-animated-spinkit'

import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Utils from '../../utils'
import { showMessage } from "react-native-flash-message";

const INITIAL_DATE = new Date().toISOString();
const width = Dimensions.get('window').width;

export const ActivityTracker = ({navigation}) => {

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().substring(0, 10);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().substring(0, 10);

  const [globalStartDate, setGlobalStartDate] = useState(firstDayOfMonth);
  const [globalEndDate, setGlobalEndDate] = useState(lastDayOfMonth);

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const [selectedDay, setSelectedDay] = useState(null);
  const [newActivity, setNewActivity] = useState('');
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  const custom = {key: 'custom', color: 'green', selectedDotColor: 'blue'};
  const noType = {key: 'noType', color: 'gray', selectedDotColor: 'blue'};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await getData()
        setLoading(false)
      } catch (error) {
        showMessage({
          message: 'Error',
          description: 'There was an error.',
          type: "danger",
        });
        console.error(error)
      }
    }
    fetchData()
  }, [])

  async function getData(startDate = globalStartDate, endDate = globalEndDate, repopulate = false) {
    try {
      let allActivities = await activitiesSQL.getAllActivitiesByDate(startDate, endDate);

      setGlobalStartDate(startDate)
      setGlobalEndDate(endDate)
      setAllActivities(allActivities)
      setupCalander(startDate, allActivities)

      if(repopulate)
        populateActivitesList(selectedDay, allActivities)
    } 
    catch (error) {
      showMessage({
        message: 'Error',
        description: 'There was an error.',
        type: "danger",
      });
    }

    return
  }

  function setupCalander(date, activities) {

    let newMarkedDates = {};

    for(let activity of activities) {

      let activityType = {}

      switch (activity.type) {
        case 'custom':
          activityType = custom;
          break;
        default:
          activityType = noType;
      }

      addActivityToMarkedDates(newMarkedDates, activity, activityType)
    }

    if(selectedDay)
      if(newMarkedDates[selectedDay.dateString] === undefined)
        newMarkedDates[selectedDay.dateString] = { selected: true };
      else
        newMarkedDates[selectedDay.dateString].selected = true;
      
    setMarkedDates(newMarkedDates)
  }

  function addActivityToMarkedDates(markedDates, activity, activityType) {

    if (markedDates[activity.date]) {
      if(markedDates[activity.date].dots) {
        const dotsArray = markedDates[activity.date].dots;
  
        const objectExists = dotsArray.some(dot => dot.key === activityType.key);
  
        if (!objectExists) 
          dotsArray.push(activityType);
      }
      else
        markedDates[activity.date].dots = [activityType];
    } 
    else 
      markedDates[activity.date] = { dots: [activityType] }; 
  }

  async function goToMonth(date, type) {
    
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + parseInt(type));
    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1).toISOString().substring(0, 10);
    const lastDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).toISOString().substring(0, 10);
    
    setLoading(true)
    await getData(startDate, lastDate)
    setLoading(false)
  }

  function calanderDayPressed(day) {

    if(selectedDay != null)
      markedDates[selectedDay.dateString].selected = false;

    setSelectedDay(day);

    if(!markedDates[day.dateString])
      markedDates[day.dateString] = {}

    markedDates[day.dateString].selected = true;

    populateActivitesList(day)
  }
  
  function populateActivitesList(day, alternateData = null) {
    let todaysActivities = []
    let useData = alternateData ? alternateData : allActivities;

    for(let activity of useData)
      if(activity.date == day.dateString)
        todaysActivities.push(activity)

    setActivities(todaysActivities)
  }

  async function addCustomActivity() {
    if (newActivity.trim() === '') {
      return;
    }
    try {
      setLoadingList(true)
      await activitiesSQL.addActivity(newActivity, selectedDay.dateString, 'custom')
      await getData(undefined, undefined, true)
      setNewActivity('')
      setLoadingList(false)
      showMessage({
        message: 'Success',
        description: 'Custom activity was added.',
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'There was an error.',
        type: "danger",
      });
      console.error(error)
    }
  }

  async function deleteActivity(id) {
    try {
      setLoadingList(true)
      await activitiesSQL.deleteActivity(id)
      await getData(undefined, undefined, true)
      setLoadingList(false)
      showMessage({
        message: 'Success',
        description: 'Custom activity was deleted.',
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: 'Error',
        description: 'There was an error.',
        type: "danger",
      });
      console.error(error)
    }
  }

  function formatString(dateObject) {
    return `${dateObject.month}/${dateObject.day}/${dateObject.year}`
  }

  const ActivityRecord = ({id, date, activity}) => { 
    return (
      <View style={styles.activityRecordContainer}>
        
        <View style={{flex: 1}}>
          <Text>{ Utils.formatISOtoDisplayDate(new Date(date)) }</Text>
        </View>
        <View style={{flex: 1}}>
          <Text>{activity}</Text>
        </View>

        <View style={styles.iconsContainer}>
          <Pressable onPress={() => { deleteActivity(id) }}>
            <Icon name="trash" size={20} color={Colors.highlight} />
          </Pressable>
        </View>
        
      </View>
    )
  }

  return (
    <>
      <View>
        <Calendar
          displayLoadingIndicator={loading}
          enableSwipeMonths
          current={INITIAL_DATE}
          style={styles.calendar}
          onDayPress={day => {
            calanderDayPressed(day)
          }}
          markingType={'multi-dot'}
          markedDates={markedDates}
          onPressArrowLeft={(callback, month) => {
            goToMonth(month, '-1')
            callback();
          }} 
          onPressArrowRight={(callback, month) => {
            goToMonth(month, '+1')
            callback();
          }} 
        />
      </View>

      {selectedDay && (
        <>
          <View>
            <Text style={styles.title}>{ formatString(selectedDay) } </Text>
          </View>

          <View style={styles.addRoutineContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setNewActivity}
              placeholder="New Custom Activity"
              value={newActivity}
            />
            <Pressable
              style={styles.circleButton}
              onPress={() => { addCustomActivity() }}
            >
              <MaterialIcon name='check-outline' size={20} color={Colors.black} />
            </Pressable>
          </View>

          {loadingList === true && (
            <Wander size={48} color={Colors.primary} />
          )}

          {loadingList === false && activities.length == 0 && (
            <View>
              <Text style={styles.noActivitiesContainer}>No activities logged...</Text>
            </View>
          )}

          {loadingList == false && activities && activities.length > 0 && (
            <>
              {activities.map((activity, index) => (
                <ActivityRecord key={index} id={activity.id} date={activity.date} activity={activity.activity} />
              ))}
            </>
          )}

        </>
      )}

    </>
  );
};

const styles = StyleSheet.create({
  calendar: {
    width: width * .85,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 30,
    color: Colors.primary
  },
  noActivitiesContainer: {
    fontSize: 15,
    textAlign: 'center',
  },
  addRoutineContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: width - 150,
    marginRight: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
  },
  iconsContainer: {

  },
  activityRecordContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 1,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
});