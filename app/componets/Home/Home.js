import React, {useRef, useState} from 'react';
import { Button, FlatList, DrawerLayoutAndroid, ScrollView, StyleSheet, View, Text, Dimensions} from 'react-native';

const width = Dimensions.get('window').width
console.log(width)
export const Home = ({navigation}) => {

  return (
    <>
      <ScrollView>
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    margin: 20,
    padding: width / 2 - 50,
    borderColor: '#58dcff'
  },
  homeContainerTitle: {
    alignItems: 'center',
  },
});