const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const Razorpay = require("razorpay");


module.exports = class DeleteUnwantedData{
    pool = new Pool(clientDetails);


    deleteUnwantedData = async ()=>{
        var postgres = await this.pool.connect();
        try {
       
            await postgres.query(
             `delete from transactions where isPaymentSuccessful=false`
            )

            await postgres.query(
             `delete from orders where isPaymentSuccessful=false`
            )
   
           postgres.release();

        } catch (e) {
        postgres.release();
        console.log(e);

        }
    }
}