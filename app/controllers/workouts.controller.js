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

const updateCardioWorkout = (params) => {
  const { id, newName } = params;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE cardioWorkouts SET name = ? WHERE id = ?",
        [newName, id],
        (txObj, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve('Workout updated successfully!');
          } else {
            reject('Failed to update workout. Workout not found.');
          }
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

const getAllStrengthWorkoutsByRoutine = (routineId, idList, getEveryday) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      let sqlQuery = "SELECT * FROM strengthWorkouts WHERE ";

      if (getEveryday) {
        sqlQuery += "(routineId = ? OR everyday = 1)";
      } else {
        sqlQuery += "routineId = ?";
      }

      if (idList && idList.length > 0) {
        const excludedIds = idList.split(',').map(id => parseInt(id.trim()));
        sqlQuery += ` AND id NOT IN (${excludedIds.join(',')})`;
      }

      tx.executeSql(
        sqlQuery,
        [routineId],
        (txObj, { rows: { _array } }) => { resolve(_array); },
        (txObj, error) => { reject(error); },
      );
    });
  });
};

const addStrengthWorkout = (params) => {
  let routineId = params.routineId;
  let name = params.newWorkout;
  let everyday = params.useEveryday;
  let totalsOnly = params.totalsOnly;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO strengthWorkouts (name, routineId, trackTotal, everyday) VALUES (?, ?, ?, ?)",
        [name, routineId, totalsOnly, everyday],
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

const updateStrengthWorkout = (params) => {
  const { id, newName, routineId, totalsOnly, useEveryday } = params;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE strengthWorkouts SET name = ?, routineId = ?, trackTotal = ?, everyday = ? WHERE id = ?",
        [newName, routineId, totalsOnly ? 1 : 0, useEveryday ? 1 : 0, id],
        (txObj, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve('Workout updated successfully!');
          } else {
            reject('Failed to update workout. Workout not found.');
          }
        },
        (txObj, error) => {
          reject(error);
        },
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
  updateWorkout: updateCardioWorkout,
};

exports.strength = {
  getAllWorkouts: getAllStrengthWorkoutsOrderedByRoutineDayNum,
  addWorkout: addStrengthWorkout,
  deleteWorkout: deleteStrengthWorkout,
  updateWorkout: updateStrengthWorkout,
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


exports.getWeeklyStrengthTotals = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT SUM(total) AS repsOverall, SUM(weightTotal) AS weightOverall FROM strengthWorkoutSummary WHERE workoutId IN (SELECT id FROM strengthWorkouts WHERE trackTotal = 0)", 
      [], 
      (txObj, { rows: { _array } }) => {

        let Overall = {
          reps: _array[0].repsOverall, 
          weight: _array[0].weightOverall,
          average: _array[0].weightOverall / _array[0].repsOverall
        }

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 7);
        const lastWeekDate = currentDate.toISOString().slice(0, 10);

        tx.executeSql("SELECT SUM(total) AS repsOverall, SUM(weightTotal) AS weightOverall FROM strengthWorkoutSummary WHERE workoutId IN (SELECT id FROM strengthWorkouts WHERE trackTotal = 0) AND date >= ?",
          [lastWeekDate],
          (txObj, { rows: { _array } }) => {

            let weekly = {
              reps: _array[0].repsOverall, 
              weight: _array[0].weightOverall,
              average: _array[0].weightOverall / _array[0].repsOverall
            }

            resolve({ Overall, weekly });
          },
          (txObj, error) => { reject(error) },
        );
      },
      (txObj, error) => { reject(error) });
    });
  });
};