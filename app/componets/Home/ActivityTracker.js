import React, {useState, useEffect} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Pressable, TextInput} from 'react-native';
import * as Colors from '../../config/colors'


import {Calendar, CalendarUtils} from 'react-native-calendars';

const INITIAL_DATE = new Date().toISOString();
const width = Dimensions.get('window').width;

export const ActivityTracker = ({navigation}) => {

  return (
    <>
      <Calendar
        enableSwipeMonths
        current={INITIAL_DATE}
        style={styles.calendar}
        onDayPress={console.log('day pressed')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  calendar: {
    width: width * .85,
  },
});