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


const addCardioWorkout = (params) => {
  let workout = params.newWorkout
  let distanceEnabled = params.distanceEnabled
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO cardioWorkouts (name, trackDistance) VALUES (?, ?)",
        [workout, distanceEnabled],
        (txObj, { rows: { _array } }) => {
          resolve('Workout inserted successfully!!');
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

const addStrengthWorkout = (params) => {
  let routineId = params.routineId
  let name = params.newWorkout
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

const deleteCardioWorkout = (id) => {
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

const deleteStrengthWorkout = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("DELETE FROM strengthWorkouts WHERE id =?",
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
exports.deleteCardioWorkout = deleteCardioWorkout
exports.deleteStrengthWorkout = deleteStrengthWorkout

exports.cardio = {
  getAllWorkouts: getAllCardioWorkouts,
  addWorkout: addCardioWorkout,
  deleteWorkout: deleteCardioWorkout,
};

exports.strength = {
  getAllWorkouts: getAllStrengthWorkoutsByRoutine,
  addWorkout: addStrengthWorkout,
  deleteWorkout: deleteStrengthWorkout,
};

exports.getWeeklyTotals = () => {
  return new Promise((resolve, reject) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    db.transaction(tx => {
      tx.executeSql(
        "SELECT intensity, SUM(duration) AS totalDuration FROM cardioWorkoutsL1 WHERE date >= ? GROUP BY intensity",
        [oneWeekAgo.toISOString()],
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