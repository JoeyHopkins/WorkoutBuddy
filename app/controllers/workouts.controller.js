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

const getAllStrengthWorkoutsOrderedByRoutineDayNum = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT sw.* FROM strengthWorkouts sw JOIN routines r ON sw.routineId = r.id ORDER BY r.dayNum, sw.name",
        null,
        (txObj, { rows: { _array } }) => { 
          resolve(_array);
        },
        (txObj, error) => { reject(error); }
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
      tx.executeSql(
        "DELETE FROM cardioWorkouts WHERE id = ?",
        [id],
        (txObj, { rows: { _array } }) => {
          // First delete operation completed successfully
          tx.executeSql(
            "DELETE FROM cardioWorkoutsL1 WHERE workoutId = ?",
            [id],
            (txObj, { rows: { _array } }) => {
              // Second delete operation completed successfully
              tx.executeSql(
                "DELETE FROM cardioWorkoutsL2 WHERE workoutId = ?",
                [id],
                (txObj, { rows: { _array } }) => {
                  // Third delete operation completed successfully
                  resolve('Workout deleted successfully!!');
                },
                (txObj, error) => {
                  // Error occurred during the third delete operation
                  reject(error);
                }
              );
            },
            (txObj, error) => {
              // Error occurred during the second delete operation
              reject(error);
            }
          );
        },
        (txObj, error) => {
          // Error occurred during the first delete operation
          reject(error);
        }
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
  getAllWorkouts: getAllStrengthWorkoutsOrderedByRoutineDayNum,
  addWorkout: addStrengthWorkout,
  deleteWorkout: deleteStrengthWorkout,
};

exports.getWeeklyCardioTimeTotals = () => {
  return new Promise((resolve, reject) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    db.transaction(tx => {
      tx.executeSql( 
`SELECT 
  intensity, 
  SUM(duration) AS totalDuration,
  date
FROM (
    SELECT intensity, duration, date FROM cardioWorkoutsL1
    UNION ALL
    SELECT intensity, duration, date FROM cardioWorkoutsL2
) AS combinedWorkouts 
WHERE 
  date >= ? 
GROUP BY 
  intensity`,
        [oneWeekAgo.toISOString()],
        (txObj, { rows: { _array } }) => {
        
          const intensityMap = {};
          const outputArray = [];
        
          _array.forEach(item => {
            intensityMap[item.intensity] = item;
          });
        
          for (let intensity = 1; intensity <= 3; intensity++) 
            if (!intensityMap[intensity])
              outputArray.push({ intensity, totalDuration: 0 });
            else
              outputArray.push(intensityMap[intensity]);

          outputArray.sort((a, b) => a.intensity - b.intensity);
        
          resolve(outputArray);
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

exports.getWeeklyCardioDistanceTotals = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT SUM(distance) AS mileOverall FROM cardioWorkoutsL2", 
      [], 
      (txObj, { rows: { _array } }) => {

        const mileOverall = _array[0].mileOverall;

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 7);
        const lastWeekDate = currentDate.toISOString().slice(0, 10);

        tx.executeSql("SELECT SUM(distance) AS mileWeek FROM cardioWorkoutsL2 WHERE date >= ?",
          [lastWeekDate],
          (txObj, { rows: { _array } }) => {
            const mileWeek = _array[0].mileWeek;
            resolve({ mileWeek, mileOverall });
          },
          (txObj, error) => { reject(error) },
        );
      },
      (txObj, error) => { reject(error) });
    });
  });
};
