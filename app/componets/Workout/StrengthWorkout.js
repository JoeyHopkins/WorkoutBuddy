import { Text, View } from "react-native"

export const StrengthWorkout = ({ navigation, setPageMode, workouts }) => {

  const Record = ({ item }) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text>ID: {item.id}</Text>
        <Text>Name: {item.name}</Text>
        <Text>Routine ID: {item.routineId}</Text>
      </View>
    );
  };

  return (
    <View>
      {workouts.map((item, index) => (
        <Record key={index} item={item} />
      ))}
    </View>
  )
}