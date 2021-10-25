const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const dateFormat = require("dateformat");


module.exports = class Database {
  pool = new Pool(clientDetails);

  getAllProducts = async () => {
    var postgres = await this.pool.connect();
    try {
      var products = await postgres.query(
        "select * from products where isavaliable is true"
      );
      postgres.release();
      return products.rows;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };


  getMyProducts = async () => {
    var postgres = await this.pool.connect();
    try {
      var products = await postgres.query(
        "select * from products order by productName"
      );
      postgres.release();
      return products.rows;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };

  deleteProduct = async (productID) => {
    var postgres = await this.pool.connect();
    try {
      postgres.query(`delete from products where productID = $1`, [productID]);
      postgres.release();

      return true;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  updateProduct = async (
    productID,
    productName,
    ownerID,
    discription,
    category,
    price,
    quantity,
    imageUrl,
    avaliableOn,
    isAvailable = true,
    discount = 0
  ) => {
    var postgres = await this.pool.connect();
    try {
      postgres.query(
        `update products set
                           productName =$2,
                           ownerID = $3,
                           discription = $4,
                           category = $5,
                           price = $6,
                           quantity = $7,
                           imageUrl = $8,
                           isavaliable = $9,
                           discount = $10 where productID = $1`,
        [
          productID,
          productName,
          ownerID,
          discription,
          category,
          price,
          quantity,
          imageUrl,
          isAvailable,
          discount
        ]
      );
      postgres.release();
      console.log("Update successfully")
      return true;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  addProducts = async (
    productID,
    productName,
    ownerID,
    discription,
    category,
    price,
    quantity,
    imageUrl,
    avaliableOn,
    isAvailable = true,
    discount = 0
  ) => {
    var postgres = await this.pool.connect();
    try {
      postgres.query(
        `insert into products(
                           productID,
                           productName,
                           ownerID,
                           discription,
                           category,
                           price,
                           quantity,
                           imageUrl,
                           isavaliable,discount,
                           availableOn
                          ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          productID,
          productName,
          ownerID,
          discription,
          category,
          price,
          quantity,
          imageUrl,
          isAvailable,
          discount,
          avaliableOn
        ]
      );
      postgres.release();
      return true;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  getMyOrders = async (id,status) => {
    var postgres = await this.pool.connect();
    try {
      if(!status || status=="all"){
        var orders = (
          await postgres.query(
            `select * from orders where cast(orderdby->>'id' as varchar) = $1 and isPaymentSuccessful=true order by orederId desc`,
            [id]
          )
        ).rows;
      }else if(status){
        var orders = (
          await postgres.query(
            `select * from orders where cast(orderdby->>'id' as varchar) = $1 and isPaymentSuccessful=true and status = $2 order by orederId desc`,
            [id,status]
          )
        ).rows;
      }
  
      postgres.release();
      return orders;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };

  getOrdersWithOrderID = async (id) => {
    var postgres = await this.pool.connect();

    try {
      var orders = (
        await postgres.query(
          `select * from orders  where  = $1 and isPaymentSuccessful=true`,
          [id]
        )
      ).rows;
      postgres.release();
      return orders;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };

  getAllOrders = async (id) => {
    var postgres = await this.pool.connect();

    try {
      var orders = (await postgres.query(`select * from orders order by orederId desc`)).rows;
      postgres.release();
      return orders;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };


  getOrderByQr = async (qrToken)=>{
    var postgres = await this.pool.connect();
    try {
      await postgres.query(`set timezone TO 'Asia/Kolkata'`);
      var orders = (await postgres
        .query(`select * from orders where qrToken = $1`,[qrToken])).rows;
      console.log("Orders =", orders)
      postgres.release();
      return orders;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  }

  getAllPendingOrders = async()=>{
    var postgres = await this.pool.connect();
    try {
      var orders = (await postgres.query(`select * from orders where status = 'pending' and isPaymentSuccessful = TRUE`)).rows;
      postgres.release();
      return orders;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  }

  getDeliveredOrders = async()=>{
    var postgres = await this.pool.connect();
    try {
      var orders = (await postgres.query(`select * from orders where status = 'delivered'`)).rows;
      postgres.release();
      return orders;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  }

  getUserWithID = async (id) => {
    var postgres = await this.pool.connect();
    try {
      var user = await postgres.query(
        "select * from users where id = $1",
        [id]
      );
      postgres.release();
      return user.rows;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };


  updateStatus = async (id) => {
    var postgres = await this.pool.connect();

    try {      
      var currentTime = new Date();
      var currentOffset = currentTime.getTimezoneOffset();
      var ISTOffset = 330; 
      var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
      var deliveredAt = dateFormat(ISTTime, "mm-dd-yyyy hh:MM:ss");
      var orders = (
        await postgres.query(`select * from orders  where qrtoken = $1`, [id])
      ).rows[0];
      console.log("Delivery = ",id, orders);
      if (!orders) {
        postgres.release();
        return {result:"invalid token"};
      }
      if (orders.status == "pending") {
        await postgres.query(
          `update orders set status = 'delivered',deliveredAt = $2 where qrtoken = $1`,
          [id,deliveredAt]
        );
        postgres.release();
        return {result:"success",object:orders};
      } else {
        postgres.release();
        return {result:orders.status};
      }
    } catch (e) {
      console.error(e)
      postgres.release();
      return {result:"failed"};
    }
  };
};
