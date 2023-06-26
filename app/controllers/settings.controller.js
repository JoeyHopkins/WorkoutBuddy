import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getSetting = (settingName) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM settings WHERE setting = ?",
        [settingName],
        (txObj, { rows: { _array } }) => { 
          resolve(_array);
        },
        (txObj, error) => { 
          reject(error);
        }
      );
    });
  });
};

exports.createNewSetting = (settingData, configData) => {
  console.log(settingData, configData)
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO settings (setting, config) VALUES (?, ?)",
        [settingData, configData],
        (txObj, resultSet) => {
          console.log('success')
          const { insertId } = resultSet;
          console.log('insertId')
          console.log(insertId)
          resolve(insertId);
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};