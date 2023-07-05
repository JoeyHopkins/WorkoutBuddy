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
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM strengthWorkouts",
        null,
        (txObj, { rows: { _array } }) => { 
          resolve(_array)
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};

const getAllStrengthWorkoutsByRoutine = (routineId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM strengthWorkouts WHERE routineId = ?",
        [routineId],
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


const addCardioWorkout = (workout) => {
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

const addStrengthWorkout = (name, routineId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO strengthWorkouts (name, routineId) VALUES (?, ?)",
        [name, routineId],
        (txObj, { rows: { _array } }) => {
          resolve('Workout inserted successfully!');
        },
        (txObj, error) => {
          reject(error);
        },
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
exports.addCardioWorkout = addCardioWorkout
exports.getAllStrengthWorkouts = getAllStrengthWorkouts
exports.addStrengthWorkout = addStrengthWorkout
exports.getAllStrengthWorkoutsByRoutine = getAllStrengthWorkoutsByRoutine

exports.cardio = {
  getAllWorkouts: getAllCardioWorkouts,
  addWorkout: addCardioWorkout,
};

exports.strength = {
  getAllWorkouts: getAllStrengthWorkoutsByRoutine,
  addWorkout: addStrengthWorkout,
};