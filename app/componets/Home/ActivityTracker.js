import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as activitiesSQL from '../../controllers/activities.controller'
import { Wander } from 'react-native-animated-spinkit'

import {Calendar, CalendarUtils} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Utils from '../../utils'

const INITIAL_DATE = new Date().toISOString();
const width = Dimensions.get('window').width;

export const ActivityTracker = ({navigation}) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [newActivity, setNewActivity] = useState('');
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  function formatString(dateObject) {
    return `${dateObject.month}/${dateObject.day}/${dateObject.year}`
  }

  function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let allActivities = await activitiesSQL.getAllActivities()
        setAllActivities(allActivities)
        setupCalander(allActivities)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])


  //need to add type to activity
  async function addCustomActivity() {
    if (newActivity.trim() === '') {
      return;
    }
    try {
      setLoading(true)
      await activitiesSQL.addActivity(newActivity, selectedDay.dateString, 'custom')
      setNewActivity('')
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  function setupCalander(activities) {
    let dates = {}
    let color = ''

    for(let activity of activities) {

      switch (activity.type) {
        case 'custom':
          color = Colors.primary
          break;
        default:
          color = Colors.backgroundGray
      }
      
      dates[activity.date] = {
        marked: true,
        dotColor: color,
      }
    }

    setMarkedDates(dates)
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
  
  function populateActivitesList(day) {
    let todaysActivities = []
    
    for(let activity of allActivities)
      if(activity.date == day.dateString)
        todaysActivities.push(activity)
    
    setActivities(todaysActivities)
  }

  async function deleteActivity(id) {
    try {
      setLoading(true)
      await activitiesSQL.deleteActivity(id)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const ActivityRecord = ({id, date, activity}) => { 
    return (
      <View style={styles.activityRecordContainer}>
        
        <View style={{flex: 1}}>
          <Text>{Utils.formatISOtoDisplayDate(new Date(date))}</Text>
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
          enableSwipeMonths
          current={INITIAL_DATE}
          style={styles.calendar}
          onDayPress={day => {
            calanderDayPressed(day)
          }}
          markedDates={markedDates}
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
            />
            <Pressable
              style={styles.circleButton}
              onPress={() => { addCustomActivity() }}
            >
              <MaterialIcon name='check-outline' size={20} color={Colors.black} />
            </Pressable>
          </View>

          {loading === true && (
            <Wander size={48} color={Colors.primary} />
          )}

          {loading === false && activities.length == 0 && (
            <View>
              <Text style={styles.noActivitiesContainer}>No activities logged...</Text>
            </View>
          )}

          {activities && activities.length > 0 && loading == false && (
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