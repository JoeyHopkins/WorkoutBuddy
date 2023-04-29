import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";

exports.getReport = () => {
  let date = new Date()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePicked, setDatePicked] = useState(date.toLocaleDateString());
  const [weightPicked, setWeightPicked] = useState('');

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
    console.log('datePicked')
    console.log(datePicked)
    console.log('weightPicked')
    console.log(weightPicked)
  }

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