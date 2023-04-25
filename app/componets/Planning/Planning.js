import { StyleSheet, Text, View, Button } from 'react-native';

export const Planning = ({navigation}) => {
  return (
    <Button
      title="Go to Reports Page"
      onPress={() =>
        navigation.navigate('Reports', {name: 'Jane'})
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
