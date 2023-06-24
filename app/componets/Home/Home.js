import React, {useRef, useState} from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions} from 'react-native';
import * as Colors from '../../config/colors'

const width = Dimensions.get('window').width

export const Home = ({navigation}) => {

  return (
    <>
      <ScrollView style={styles.background}>
        <View style={styles.homeContainerTitle}>
          <Text style={styles.homeContainer}>Routines</Text>
        </View>
        <View style={styles.homeContainerTitle}>
          <Text style={styles.homeContainer}>Progress</Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderRadius: 20,
    margin: 20,
    padding: width / 2 - 50,
    borderColor: Colors.primary
  },
  homeContainerTitle: {
    alignItems: 'center',
  },
  background: {
    backgroundColor: Colors.background,
  },
});