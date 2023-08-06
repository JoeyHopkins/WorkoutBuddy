import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.insertStrengthWorkoutSummary = (id, params) => {
  const { date, reps, total, weight, weightTotal} = params

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("INSERT INTO strengthWorkoutSummary (workoutId, date, reps, total, weight, weightTotal) VALUES (?, ?, ?, ?, ?, ?)",
        [id, date, reps, total, weight, weightTotal],
        (txObj, ResultSet) => { resolve(ResultSet); },
        (txObj, error) => { reject(error); },
      );
    });
  });
};

exports.getPersonalBestsByWorkoutID = (idList) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      idList = idList.split(',')
      const placeholders = idList.map(() => '?').join(',');

      // SQL query with the IN operator to filter by workoutId in idList
      let sqlQuery = `SELECT * FROM strengthBestRecords WHERE workoutId IN (${placeholders})`;
      tx.executeSql(
        sqlQuery,
        idList, // Pass the idList as the second parameter to replace the placeholders
        (txObj, { rows: { _array } }) => { resolve(_array); },
        (txObj, error) => { reject(error); },
      );
    });
  });
};

exports.runAgainstOverallBest = (id, params) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM strengthBestRecords WHERE workoutId = ?",
        [id],
        async (txObj, { rows: { _array } }) => {

          if(_array.length == 0)
            await insertNewBestRecord(id, params)
          else
            await checkForUpdates(_array, id, params)

          resolve(_array); 
        },
        (txObj, error) => { reject(error); },
      );
    });
  });
};

function insertNewBestRecord(id, params) {
  let {date, reps, total, weight, weightTotal} = params
  
  if(reps == "0" || reps =='' || reps == null)
    return

  let record = JSON.stringify({
    byTotal: {
      date: date,
      reps: reps,
      total: total,
      weight: weight,
      weightTotal: weightTotal
    },
    bySet: {
      reps: reps,
      weight: weight,
    }
  })
  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("INSERT INTO strengthBestRecords (workoutId, record) VALUES (?, ?)",
        [id, record],
        (txObj, ResultSet) => { resolve(ResultSet); },
        (txObj, error) => { reject(error); },
      );
    });
  });
}

function checkForUpdates(result, id, params) {

  let parserdRecord = JSON.parse(result[0].record)
  let bySet = parserdRecord.bySet
  let byTotal = parserdRecord.byTotal

  if(!byTotal.weight && params.total >= byTotal.total) 
    byTotal = params
  else if(byTotal.weight && params.weightTotal >= byTotal.weightTotal)
    if(params.total >= byTotal.total)
      byTotal = params

  let { finalReps, finalWeight } = combineReps(bySet, params)
  bySet.reps = finalReps
  bySet.weight = finalWeight

  let returnObject = JSON.stringify({
    bySet: bySet,
    byTotal: byTotal
  })

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE strengthBestRecords SET record = ? WHERE workoutId = ?",
        [returnObject, id],
        (txObj, resultSet) => {
          resolve(resultSet);
        },
        (txObj, error) => {
          reject(error);
        },
      );
    });
  });
}

function combineReps(object, newObject) {
  // Step 1: Convert reps strings into arrays of integers
  const reps1 = object.reps.split(",").map(Number).filter((num) => !isNaN(num));
  const reps2 = newObject.reps.split(",").map(Number).filter((num) => !isNaN(num));
  let weight1 = null
  let weight2 = null
  let finalReps = null
  let finalWeight = null

  if(object.weight)
    weight1 = object.weight.split(",").map(Number).filter((num) => !isNaN(num));
  if(newObject.weight)
    weight2 = newObject.weight.split(",").map(Number).filter((num) => !isNaN(num));

  // Step 2: Compare and keep the bigger value for each position
  if(!object.weight)
  {
    const combinedReps = reps1.map((val, index) => Math.max(val, reps2[index]));

    // Handle any remaining elements in the longer array
    if (reps1.length > reps2.length)
      combinedReps.push(...reps1.slice(reps2.length));
    else if (reps2.length > reps1.length)
      combinedReps.push(...reps2.slice(reps1.length));
    
    finalReps = combinedReps.filter((num) => !isNaN(num)).join(",");
    finalWeight = null
  }
  else {
    if(reps1.length >= reps2.length)
    {
      let { reps, weight } = combineWorkoutSets(reps1, weight1, reps2, weight2)
      finalReps = reps
      finalWeight = weight
    }
    else {
      let { reps, weight } = combineWorkoutSets(reps2, weight2, reps1, weight1)
      finalReps = reps
      finalWeight = weight
    }
  }

  return { finalReps: finalReps, finalWeight: finalWeight }
}

function combineWorkoutSets(reps1, weight1, reps2, weight2) {
  let finalReps = [];
  let finalWeight = [];

  for(let set in reps1) {
    if(weight1[set] > weight2[set] || 
      (weight1[set] == weight2[set] && reps1[set] >= reps2[set]) || 
      reps2[set] == undefined
    ) {
      finalReps[set] = reps1[set]
      finalWeight[set] = weight1[set]
    }
    else if (
      weight2[set] > weight1[set] ||
      (weight1[set] == weight2[set] && reps2[set] > reps1[set])
    ) {
      finalReps[set] = reps2[set]
      finalWeight[set] = weight2[set]
    }
  }

  finalReps = finalReps.join(',')
  finalWeight = finalWeight.join(',')

  return { reps: finalReps, weight: finalWeight }
}


exports.getLastWorkoutSummaryByWorkoutID = (idList) => {

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const promises = idList.map((idItem) => {
          return new Promise((resolveItem, rejectItem) => {
            tx.executeSql(
              "SELECT * FROM strengthWorkoutSummary WHERE workoutId = ? ORDER BY id DESC LIMIT 1",
              [idItem],
              (txObj, { rows: { _array } }) => {
                if (_array.length === 0) {
                  resolveItem(); // Resolve with null if no records found for the ID
                } else {
                  resolveItem(_array[0]); // Resolve with the last record for the ID
                }
              },
              (txObj, error) => {
                rejectItem(error);
              }
            );
          });
        });

        // Wait for all the promises to be resolved
        Promise.all(promises)
          .then((results) => {
            resolve(results); // Resolve the main promise with the array of results
          })
          .catch((error) => {
            reject(error); // Reject the main promise if any error occurs during the SQL queries
          });
      },
      (error) => {
        reject(error); // Reject the main promise if the transaction cannot be initiated
      }
    );
  });
};