import { View, Text, TextInput, Button, StyleSheet, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import reportsSql from '../../controllers/reports.controller'

exports.getReport = () => {
  let date = new Date()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePicked, setDatePicked] = useState(date.toLocaleDateString());
  const [weightPicked, setWeightPicked] = useState('');
  const [weightList, setWeightList] = useState([]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDatePicked(date.toLocaleDateString())
    hideDatePicker();
  };

  function submitNewWeight() {
    reportsSql.submitNewWeight(weightPicked, datePicked)
    reportsSql.getAllWeight(setWeightList)
    Keyboard.dismiss()
  }

  useEffect( () => {
    reportsSql.getAllWeight(setWeightList)
  }, [])

  return (
    <View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Text 
        style={styles.dateText}
        onPress={showDatePicker}
      >
        {datePicked}
        <Text style={styles.setDateText}> Set</Text>
      </Text>

      <TextInput
        inputMode="numeric"
        style={styles.input}
        placeholder="Weight"
        onChangeText={setWeightPicked}
        value={weightPicked}
      ></TextInput>

      <Button
        title="Submit"
        onPress={() => {
          submitNewWeight()
        }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  dateText: {
    marginLeft: 12,
  },
  setDateText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});