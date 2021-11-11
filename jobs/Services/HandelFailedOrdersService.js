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
            var {paymentmetadata:{id},amount,walletamount,orderdby} = order
            this.verifyRazorpayPayment(id,amount-walletamount,walletamount,orderdby.id);
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
  

    verifyRazorpayPayment = async (orderID, amount,walletAmount,id) => {
        console.log("Order ID =",orderID,"Amount = ",amount)
        var postgres = await this.pool.connect();
        try {
          await postgres.query("begin");

          var ordersDetails = (await this.instance.orders.fetchPayments(orderID)).items[0];
          console.log("Payment Details = ", ordersDetails);
    
          var isVerified = (ordersDetails.status == "authorized" || ordersDetails.status == "captured") && parseInt(ordersDetails.amount/100) == parseInt(amount);
           
          if (isVerified) {
            var user = (
              await postgres.query("select * from users where id=$1 for update", [id])
            ).rows[0];  
            if(!user){
              throw Error("Invalid User")
            }
            const balance = user.balance
            if(parseInt(balance)<parseInt(walletAmount)){
              throw Error("insufficient balance")
            }
            await postgres.query(
              "update users set balance = balance - $1 where id = $2",
              [walletAmount, id]
            );
            var data = await postgres.query(
              `update orders set paymentMetadata = $2, isPaymentSuccessful=true where cast(paymentmetadata->>'id' as varchar) = $1 returning *`,
              [orderID, ordersDetails]
            );
            await postgres.query(
              `insert into transactions(
                            transactionType,
                            amount,
                            fromMetadata ,
                            toMetadata,
                            timestamp,
                            isPaymentSuccessful
                            )
                            values($1,$2,$3,$4,$5,$6) returning *`,
              [
                "PAYING_RMART",
                walletAmount,
                data.rows[0].orderdby,
                {
                  "id":data.rows[0].orederid
                },
                data.rows[0].transactiontime,
                true,
              ]
            )
            console.log("Updated = ",data.rows)
            postgres.release();
            return isVerified && data.rows.length > 0;
          } else {
            console.log("Updated = Not verified")
            await postgres.query("rollback");
            postgres.release();
            return false;
          }
        } catch (error) {
          postgres.release();
          await postgres.query("rollback");
          console.log(error);
          return false;
        }
      };
}