import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as activitiesSQL from '../../controllers/activities.controller'
import { Wander } from 'react-native-animated-spinkit'

import {Calendar, CalendarUtils} from 'react-native-calendars';

const INITIAL_DATE = new Date().toISOString();
const width = Dimensions.get('window').width;

export const ActivityTracker = ({navigation}) => {

  const [selectedDay, setSelectedDay] = useState(null);
  const [newActivity, setNewActivity] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

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
        setActivities(allActivities)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <View>
        <Calendar
          enableSwipeMonths
          current={INITIAL_DATE}
          style={styles.calendar}
          onDayPress={day => {
            setSelectedDay(day);
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
            />
            <Pressable
              style={styles.circleButton}
              onPress={() => { console.log(newActivity) }}
            >
              <MaterialIcon name='check-outline' size={20} color={Colors.black} />
            </Pressable>
          </View>

          {loading === true && (
            <Wander size={48} color={Colors.primary} />
          )}

          {loading === false && (
            <View>
              <Text style={styles.noActivitiesContainer}>No activities logged...</Text>
            </View>
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
});