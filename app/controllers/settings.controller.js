import * as SQLite from 'expo-sqlite'
import homeSql from './home.controller'
const db = SQLite.openDatabase('workouBuddy.db');

// todaysRoutine

exports.getSetting = (settingName) => {
  return getSetting(settingName)
};

function getSetting(settingName) {
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
}

exports.createNewSetting = (settingData, configData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO settings (setting, config) VALUES (?, ?)",
        [settingData, configData],
        (txObj, resultSet) => {
          const { insertId } = resultSet;
          resolve(insertId);
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

exports.updateSetting = (setting, config) => {
  updateSetting(setting, config)
};

function updateSetting(setting, config) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE settings SET config = ? WHERE setting = ?",
        [config, setting],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            resolve(resultSet.rowsAffected);
          } else {
            reject(new Error("No rows were updated."));
          }
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
}

exports.updateRoutineSetting = async (currentRoutineID) => {

  let routines = await homeSql.getAllRoutines()
  const currentIndex = routines.findIndex(routine => routine.id === currentRoutineID);

  if (currentIndex === -1)
    return null;

  // Get the index of the next routine, considering wrapping around
  const nextIndex = (currentIndex + 1) % routines.length; 
  updateSetting('todaysRoutine', routines[nextIndex].id)
};
