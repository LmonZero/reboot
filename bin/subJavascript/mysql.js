const mysqlHelper = require('../../lib/helper/helper_mysql')

class subMysql {
    constructor() {
    }
    init(mysqlHelper = { host: '127.0.0.1', user: "root", password: "root", database='lmonFund' }) {
        this.mysqlHelper = new mysqlHelper()
        this.mysqlHelper.init()
    }

    async beginTrans() {

        var dbConn = null;
        try {
            dbConn = await this.mysqlHelper.beginTrans()
        } catch (error) {
            throw (error)
        }
        return dbConn
    }

    async commitTrans(dbConn) {
        try {
            await this.mysqlHelper.commit(dbConn)
        } catch (error) {

            throw (error)
        }
    }

    async rollback(dbConn) {
        try {
            await this.mysqlHelper.rollback(dbConn)
        } catch (error) {
            tools.error('[Error] --- pello transaction db error when rollback', error)
        }
    }

    async runSqlInTrans(sql, sqlParam, dbConn) {
        var arr = null;
        try {
            arr = await this.mysqlHelper.dbOpInTrans(sql, sqlParam, dbConn)
        } catch (error) {
            throw (error)
        }
        return arr
    }

    async dbop(sql) {
        return await this.mysqlHelper.dbOp(sql);
    }

    async dbTest() {
        let sql = 'show table status;';
        let arr = await this.dbop(sql);
        console.log('dbtest table length is -> ', arr.length);
    }
}