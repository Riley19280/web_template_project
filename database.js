const sanitizer = require('sanitizer');
const mysql = require('promise-mysql');


let conn;
const dbconfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
};


module.exports.INIT = async function () {
    if (conn == null)
        return mysql.createConnection(dbconfig).then(function(con){
            conn = con;
            console.log('Database connection initialized.')
        })
        // .then(() => {
        //     return exports.updateQuoteTypesIndex()
        // })
        // .then(() => {
        //     console.log(exports.QUOTE_TYPES)
    // })
    else {
        return Promise.resolve()
        // console.log("Database connection already initialized.")
    }
}

module.exports.close = function () {
    return new Promise((res,reject) => {
        conn.end()
        res()
    })
}