import { StyleSheet, Text, View, Button } from 'react-native';

export const Workout = ({navigation}) => {
  return (
    <Button
      title="Go to Planning Page"
      onPress={() =>
        navigation.navigate('Planning', {name: 'Jane'})
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
