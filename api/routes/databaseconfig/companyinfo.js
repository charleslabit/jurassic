const mssql = require('mssql')

const connect = function() {
    const conn = new mssql.ConnectionPool({
        user: 'sa',
        password: '81at84',
        server: 'HRDSQL',
        database: 'CompanyInformation',
        options: {
            encrypt: false,
            enableArithAbort: true
        },
    })
    return conn
}

module.exports = connect
