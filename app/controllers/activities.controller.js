import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getAllActivities = (setRoutineList) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM activities",
        null,
        (txObj, { rows: { _array } }) => { 
          resolve(_array)
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};

exports.getAllActivitiesByDate = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM activities WHERE date BETWEEN ? AND ?",
        [startDate, endDate],
        (txObj, { rows: { _array } }) => { 
          resolve(_array)
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};


exports.addActivity = (activity, date, type) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO activities (date, activity, type) VALUES (?, ?, ?)",
        [date, activity, type],
        (txObj, res) => {
          resolve(res);
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

exports.deleteActivity = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "DELETE FROM activities WHERE id = ?",
        [id],
        (txObj, res) => {
          resolve(res);
        },
        (txObj, error) => {
          reject(error);
        }
      );
    })
  })
};