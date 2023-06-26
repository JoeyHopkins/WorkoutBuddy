import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'


import {Calendar, CalendarUtils} from 'react-native-calendars';

const INITIAL_DATE = new Date().toISOString();
const width = Dimensions.get('window').width;

export const ActivityTracker = ({navigation}) => {

  const [selectedDay, setSelectedDay] = useState(null);

  function formatString(dateObject) {
    return `${dateObject.month}/${dateObject.day}/${dateObject.year}`
  }

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
          <View>
            <Text style={styles.noActivitiesContainer}>No activities logged...</Text>
          </View>
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
    paddingTop: 30,
    color: Colors.primary
  },
  noActivitiesContainer: {
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 30,
  }
});