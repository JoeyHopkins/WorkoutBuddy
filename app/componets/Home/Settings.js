import { Pressable, Text, Alert } from "react-native";
import styles from '../../config/styles'
import appSql from '../../../app/controllers/app.controller';

export const Settings = () => {

  const handleBackButton = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to reset app data? You will lose everything and you cannot get this back',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await appSql.dropAllTables();
            await appSql.createTables();
            await appSql.getTablesFromDB();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <Pressable
        style={[styles.button, styles.marginVertical_M]}
        onPress={handleBackButton}
      >
        <Text style={styles.textWhite}>Reset App Data</Text>
      </Pressable>
    </>
  );
}