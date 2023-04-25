import { StyleSheet, Text, View, Button } from 'react-native';

//https://reactnavigation.org/docs/native-stack-navigator/#options
export const Reports = ({navigation}) => {
  return (
    <Button
      title="Go to Workout Page"
      onPress={() =>
        navigation.navigate('Workout', {name: 'Jane'})
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
