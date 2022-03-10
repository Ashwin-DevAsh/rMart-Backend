const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");

module.exports = class OrderExpery{
    pool = new Pool(clientDetails);

    closeOrder = async()=>{
        // var postgres = await this.pool.connect();
        // try{
        //      await postgres.query(`set timezone TO 'Asia/Kolkata'`);
        //      var products = await postgres.query(
        //         `update orders set status = 'expired' WHERE to_timestamp(timestamp, 'MM-DD-YYYY HH24:MI:SS') <= TIMESTAMP 'today' and status = 'pending' returning *`
        //      );
        //      console.log(products)
        //     postgres.release();

        // }catch(error){
        //     postgres.release();
        //     console.log(error)
        // }
    }
}