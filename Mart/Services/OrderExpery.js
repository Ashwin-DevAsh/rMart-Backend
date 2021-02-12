const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");

module.exports = class OrderExpery{
    pool = new Pool(clientDetails);

    closeOrder = ()=>{
        var postgres = await this.pool.connect();
        try{
            var products = await postgres.query(
                `update orders set status = 'expaired' WHERE to_timestamp(timestamp, 'MM-DD-YYYY HH24:MI:SS') = TIMESTAMP 'yesterday' return *`
             );
        }catch(error){
            postgres.release();
            console.log(error)
        }
     
    }
}