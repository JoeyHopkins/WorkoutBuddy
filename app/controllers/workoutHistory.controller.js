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

exports.updateWorkoutSummary = (id, newData) => {
  const { reps, total, weight, weightTotal } = newData;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE strengthWorkoutSummary SET reps = ?, total = ?, weight = ?, weightTotal = ? WHERE id = ?`,
        [reps, total, weight, weightTotal, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            resolve('Record updated successfully');
          } else {
            reject(new Error('Record not found'));
          }
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};
