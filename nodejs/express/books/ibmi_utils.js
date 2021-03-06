const odbc = require('odbc');

let ibmi = (function() {
    let module = {};

    // cb format: err, result
    module.runSql = function(conn, sql, cb) {
        console.log('Running sql ' + sql);
        conn.query(sql, function(error, results) {
            if (error) {
                console.log(`=> Error ${error} from sql query ${sql}`);
                cb(error, null);
            } else {
                console.log(`=> Results ${results} from sql query ${sql}`);
                cb(null, results);
            }
        });
    };

    module.createBooksTable = function(user, cb) {
        const createSchema = 'CREATE SCHEMA BOOKSTORE';
        const createTable = `CREATE OR REPLACE TABLE
                       BOOKSTORE.Books(bookId INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY(START WITH 1, INCREMENT BY 1),
                       title VARCHAR(30) NOT NULL,
                       isbn VARCHAR(20) NOT NULL,
                       amount DECIMAL(10 , 2) NOT NULL, PRIMARY KEY (bookId))`;
        module.runSql(user.conn, createSchema, function(createSchemaError, result) {
            // if error happens here schema already exists; ignore
            module.runSql(user.conn, createTable, function(createTableErr, result) {
                // after createTable concluded and there is no error call passport callback
                if (createTableErr) cb(createTableErr, null);
                else cb(null, user);
            });
        });
    };

    // creates a user object that includes an open connection to specified ibmi
    // server
    // cb format: err, user
    module.processUserSignIn = function(host, username, password, cb) {
        let connectString = `DRIVER=IBM i Access ODBC Driver;SYSTEM=${host};UID=${username};PWD=${password}`
        odbc.connect(connectString, function(err, conn) {
            if (err) {
                console.log(`=> ODBC connection fail(username=${username}, system=${host}): ${err}`);
                cb(err, null);
            } else {
                console.log(`=> ODBC connection success(username=${username}, system=${host})`);
                // pass user to callback
                let user = {
                    username: username,
                    password: password,
                    system: host,
                    conn: conn
                };
                // create schema and books table if they don't already exist
                module.createBooksTable(user, cb);
            }
        });
    };

    return module;
})();

module.exports = ibmi;
