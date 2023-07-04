import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

const getAllCardioWorkouts = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM cardioWorkouts",
        null,
        (txObj, { rows: { _array } }) => { 
          resolve(_array)
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};

const getAllStrengthWorkouts = () => {
  console.log('\n\nhit allStrengthWorkouts')
  return []
};

exports.addCardioWorkout = (workout) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("INSERT INTO cardioWorkouts (name) VALUES (?)",
        [workout],
        (txObj, { rows: { _array } }) => { 
          resolve('Workout inserted successfully!!')
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};

exports.deleteCardioWorkout = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("DELETE FROM cardioWorkouts WHERE id =?",
        [id],
        (txObj, { rows: { _array } }) => { 
          resolve('Workout deleted successfully!!')
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};


exports.getAllCardioWorkouts = getAllCardioWorkouts
exports.getAllStrengthWorkouts = getAllStrengthWorkouts

exports.cardio = {
  getAllWorkouts: getAllCardioWorkouts,
};

exports.strength = {
  getAllWorkouts: getAllStrengthWorkouts,
};