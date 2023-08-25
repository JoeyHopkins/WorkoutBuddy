import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getWorkoutHistory = (workoutId, page, pageSize) => {
  const offset = (page - 1) * pageSize;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM strengthWorkoutSummary WHERE workoutId = ? ORDER BY id DESC LIMIT ? OFFSET ?`,
        [workoutId, pageSize, offset],
        (txObj, { rows: { _array } }) => { 
          resolve(_array);
        },
        (txObj, error) => { 
          reject(error);
        },
      );
    });
  });
};
