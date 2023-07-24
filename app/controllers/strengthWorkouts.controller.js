import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.insertStrengthTotals = (id, date, reps, total) => {

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("INSERT INTO strengthTotals (workoutId, date, reps, total) VALUES (?, ?, ?, ?)",
        [id, date, reps, total],
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
  let {date, reps, total, weight} = params

  let record = JSON.stringify({
    byTotal: {
      date: date,
      reps: reps,
      weight: weight,
      total: total
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

  if(params.total >= byTotal.total) 
    byTotal = params

  bySet.reps = combineReps(bySet, params)

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

function combineReps(obj1, obj2) {
  // Step 1: Convert reps strings into arrays of integers
  const reps1 = obj1.reps.split(",").map(Number).filter((num) => !isNaN(num));
  const reps2 = obj2.reps.split(",").map(Number).filter((num) => !isNaN(num));

  // Step 2: Compare and keep the bigger value for each position
  const combinedReps = reps1.map((val, index) => Math.max(val, reps2[index]));
  
  // Handle any remaining elements in the longer array
  if (reps1.length > reps2.length) {
    combinedReps.push(...reps1.slice(reps2.length));
  } else if (reps2.length > reps1.length) {
    combinedReps.push(...reps2.slice(reps1.length));
  }

  const finalReps = combinedReps.filter((num) => !isNaN(num)).join(",");

  return finalReps;
}