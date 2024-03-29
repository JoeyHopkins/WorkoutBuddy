import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('workouBuddy.db');

exports.getAllRoutines = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM routines ORDER BY dayNum",
        null,
        (txObj, { rows: { _array } }) => { resolve(_array) },
        (txObj, error) => { reject(error) },
      );
    });
  });
};

exports.getAllRoutinesList = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM routines ORDER BY dayNum DESC",
        null,
        (txObj, { rows: { _array } }) => { 
          resolve(_array)
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};

exports.addRoutine = async (routine) => {
  let dayNum = await findClosestDayNum() 

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO routines (dayNum, routine) VALUES (?, ?)",
        [dayNum, routine],
        (txObj, resultSet) => {
          resolve('New routine added!');
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

exports.editRoutine = async (id, newName) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE routines SET routine = ? WHERE id = ?",
        [newName, id],
        (txObj, resultSet) => {
          resolve('Routine updated successfully!');
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};


// Helper function to find the closest number to 0 that has not already been filled
const findClosestDayNum = () => {
  const table = 'routines';

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT dayNum FROM routines",
        [],
        (txObj, resultSet) => {

          if(resultSet.rows.length == 0)
            resolve(1);
          else {
            const existingDayNums = resultSet.rows._array.map((row) => row.dayNum);
            let lowestNonTakenNum = 1;
            
            while (existingDayNums.includes(lowestNonTakenNum)) 
              lowestNonTakenNum++;
            
            resolve(lowestNonTakenNum);
          }
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

exports.deleteRoutineByID = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("DELETE FROM routines WHERE id = ?", [id],
        (txObj, ResultSet) => {
          resolve('Routine deleted!');
        },
        (txObj, error) => { reject(error) },
      );
    });
  });
};

exports.moveRoutineUp = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT id, dayNum FROM routines ORDER BY dayNum ASC",
        [],
        async (txObj, resultSet) => {
          const rows = resultSet.rows._array;
          
          for(let i in rows) {
            if (rows[i].id === id) {

              if(parseInt(i) === 0 && rows[i].dayNum === 1)
                return reject('Cannot move routine up anymore');

              let dayNum = rows[i].dayNum;

              if(parseInt(i) === 0)
                return resolve(await updateRoutineDayNum(id, dayNum - 1));

              let priorID = rows[i-1].id;
              let priorDayNum = rows[i-1].dayNum;

              if(dayNum - 1 === priorDayNum)
                return resolve(await exchangeRoutineDayNum(id, dayNum, priorID, priorDayNum));
              else 
                return resolve(await updateRoutineDayNum(id, dayNum - 1));
            }
          }
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
};

function exchangeRoutineDayNum(id, currentDayNum, priorID, priorDayNum) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE routines SET dayNum = ? WHERE id = ?",
        [priorDayNum, id],
        (txObj, resultSet) => {
          tx.executeSql(
            "UPDATE routines SET dayNum = ? WHERE id = ?",
            [currentDayNum, priorID],
            () => {
              resolve('Routines have been exchanged');
            },
            (txObj, error) => {
              reject(error);
            }
          );
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
}

function updateRoutineDayNum(id, newDayNum) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE routines SET dayNum = ? WHERE id = ?",
        [newDayNum, id],
        () => {
          resolve('Routine has been updated');
        },
        (txObj, error) => {
          reject(error);
        }
      );
    });
  });
}

exports.getRoutineByID = (routineID) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM routines WHERE id = ?",
        [routineID],
        (txObj, { rows: { _array } }) => { 
          resolve(_array[0]);
        },
        (txObj, error) => { 
          reject(error);
        }
      );
    });
  });
};

exports.getEarliestRoutine = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM routines ORDER BY dayNum ASC LIMIT 1",
        [],
        (txObj, { rows: { _array } }) => { 
          resolve(_array[0]);
        },
        (txObj, error) => { 
          reject(error);
        }
      );
    });
  });
};