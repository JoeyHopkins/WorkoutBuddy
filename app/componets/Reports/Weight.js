import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";

exports.getReport = () => {
  let date = new Date()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePicked, setDatePicked] = useState(date.toLocaleDateString());

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

  return (
    <View>
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
      ></TextInput>
      <Button
        title="Submit"
        onPress={() => {
          console.log('submit record')
        }}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
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