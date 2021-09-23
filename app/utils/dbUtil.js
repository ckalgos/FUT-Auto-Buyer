const db = openDatabase(
  "userDatas",
  "1.0",
  "FIFA AUTO BUYER DB",
  2 * 1024 * 1024
);

db.transaction(function (tx) {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS Filters (filterName,settings);`,
    [],
    function (tx, results) {
      tx.executeSql(
        `CREATE UNIQUE INDEX idx_filters_filterName ON Filters (filterName);`
      );
    },
    function (tx, results) {
      console.log(results);
    }
  );
});

export const getUserFilters = () => {
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM Filters",
        [],
        function (tx, results) {
          const filters = {};
          if (results.rows.length) {
            for (let i = 0; i < results.rows.length; i++) {
              filters[results.rows[i].filterName] = results.rows[i].settings;
            }
          }
          resolve(filters);
        },
        function (tx, results) {
          reject(results);
        }
      );
    });
  });
};

export const insertFilters = (filterName, jsonData) => {
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        "REPLACE INTO Filters(filterName,settings) Values (?,?)",
        [filterName, jsonData],
        function (tx, results) {
          resolve(true);
        },
        function (tx, results) {
          reject(results);
        }
      );
    });
  });
};

export const deleteFilters = (filterName) => {
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        "DELETE FROM Filters WHERE filterName=?",
        [filterName],
        function (tx, results) {
          resolve(true);
        },
        function (tx, results) {
          reject(results);
        }
      );
    });
  });
};
