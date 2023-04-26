import React, {useRef, useState} from 'react';
import { Button, DrawerLayoutAndroid, Text, StyleSheet, View, } from 'react-native';

export const Reports = ({navigation}) => {
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('right');

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <Button
        title="Close drawer"
        onPress={() => drawer.current.closeDrawer()}
      />
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}>
      <View style={styles.container}>
        <Button
          title="Open drawer"
          onPress={() => drawer.current.openDrawer()}
        />
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});





//https://reactnavigation.org/docs/native-stack-navigator/#options
// export const Reports = ({navigation}) => {
//   return (
//     <Button
//       title="Go to Workout Page"
//       onPress={() =>
//         navigation.navigate('Workout', {name: 'Jane'})
//       }
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
