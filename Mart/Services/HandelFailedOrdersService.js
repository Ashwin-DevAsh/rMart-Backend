const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const Razorpay = require("razorpay");


module.exports = class HandelFailedOrderService{
    pool = new Pool(clientDetails);

    instance = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });

    handleFailedOrders=async()=>{
        var incompletePayments = await this.getIncompleteOrders()
        incompletePayments.forEach((order)=>{
            var {paymentmetadata:{id,amount}} = order
            this.verifyRazorpayPayment(id,amount);
        })
    }

    

    getIncompleteOrders = async ()=>{
        var postgres = await this.pool.connect();
        try {
        var orders = (
            await postgres.query(
            `select * from orders where status = 'pending' and isPaymentSuccessful=false`
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
  

    verifyRazorpayPayment = async (orderID, amount) => {
        console.log("Order ID =",orderID,"Amount"=amount)
        var postgres = await this.pool.connect();
        try {
          var ordersDetails = (await this.instance.orders.fetchPayments(orderID)).items;
          console.log("Payment Details = ", ordersDetails);
    
          console.log(ordersDetails);
          var isVerified =
            (ordersDetails.status == "authorized" ||
            ordersDetails.status == "captured") &&
            ordersDetails.amount / 100 == amount / 1;
          if (isVerified) {
            var data = await postgres.query(
              `update orders set paymentMetadata = $2, isPaymentSuccessful=true where cast(paymentmetadata->>'id' as varchar) = $1 returning *`,
              [orderID, ordersDetails]
            );
            console.log("Updated = ",data.length)
            postgres.release();
            return isVerified && data.rows.length > 0;
          } else {
            console.log("Updated = Not verified")
            postgres.release();
            return false;
          }
        } catch (error) {
          postgres.release();
    
          console.log(error);
          return false;
        }
      };
}