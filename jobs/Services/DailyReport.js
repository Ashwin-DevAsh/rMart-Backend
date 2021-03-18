const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");

module.exports = class DailyReport{
    pool = new Pool(clientDetails);

    getTodayOrders = async()=>{
        var postgres = await this.pool.connect();
        try{
             await postgres.query(`set timezone TO 'Asia/Kolkata'`);
             var todayOrders = await postgres.query(
                `select * from orders WHERE to_timestamp(timestamp, 'MM-DD-YYYY HH24:MI:SS') >= TIMESTAMP 'today' and ispaymentsuccessful is true;`
             );
             postgres.release();
             return todayOrders.rows

        }catch(error){
            postgres.release();
            console.log(error)
            return [];
        }
    }
} 