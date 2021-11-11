const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const Razorpay = require("razorpay");


module.exports = class HandelFailedOrderService{
    pool = new Pool(clientDetails);

    instance = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });

    handleFailedAddMoneyOrders=async()=>{
        var incompletePayments = await this.getIncompleteAddMoneyOrders()
        incompletePayments.forEach((order)=>{
            var {frommetadata:{id},amount,tometadata} = order
            this.verifyRazorpayPayment(id,amount,tometadata.id);
        })
    }

    

    getIncompleteAddMoneyOrders = async ()=>{
        var postgres = await this.pool.connect();
        try {
        var orders = (
            await postgres.query(
            `select * from transactions where transactionType = 'ADDING_MONEY' and isPaymentSuccessful=false`
            )
        ).rows;
        postgres.release();
        return orders;
        } catch (e) {
        postgres.release();
        console.log(e);
        return [];
        }
    }
  

    verifyRazorpayPayment = async (orderID, amount,id) => {
        console.log("Order ID =",orderID,"Amount = ",amount)
        var postgres = await this.pool.connect();
        try {
          await postgres.query("begin");
          var ordersDetails = (await this.instance.orders.fetchPayments(orderID)).items[0];
          console.log("Payment Details = ", ordersDetails);
    
          var isVerified = (ordersDetails.status == "authorized" || ordersDetails.status == "captured") && parseInt(ordersDetails.amount/100) == parseInt(amount);
         
          if (isVerified) {
            var data = await postgres.query(
              `update transactions set fromMetadata = $2,isPaymentSuccessful = true where cast(fromMetadata->>'id' as varchar) = $1 returning *`,
              [orderID, ordersDetails]
            );
            await postgres.query(
                "update users set balance = balance + $1 where id = $2",
                [ amount, id]
            );
            console.log("Updated = ",data.rows)
            await postgres.query("commit");
            postgres.release();
            return isVerified && data.rows.length > 0;
          } else {
            console.log("Updated = Not verified")
            await postgres.query("rollback");
            postgres.release();
            return false;
          }
        } catch (error) {
          await postgres.query("rollback");
          postgres.release();
          console.log(error);
          return false;
        }
      };
}