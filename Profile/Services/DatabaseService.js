const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");

module.exports = class Database {
  pool = new Pool(clientDetails);

  insertUser = async (name, email, phoneNumber, id, hashedPassword) => {
    var postgres = await this.pool.connect();
    try {
      await postgres.query(
        "insert into users(name,email,number,id,password) values($1,$2,$3,$4,$5)",
        [name, email, phoneNumber, id, hashedPassword]
      );
      postgres.release();
      return true;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  getUserWithEmailOrPhoneNumber = async (number, email) => {
    var postgres = await this.pool.connect();
    try {
      var user = await postgres.query(
        "select * from users where (email = $1 or number = $2)",
        [email, number]
      );
      postgres.release();
      return user.rows;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  getOtp = async (number, email, otp) => {
    var postgres = await this.pool.connect();
    try {
      var otpDatas = await postgres.query(
        "select * from otp where (email = $1 or number = $2) and otp = $3",
        [email, number, otp]
      );
      postgres.release();
      return otpDatas.rows;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  insertOtp = async (number, email, otp) => {
    var postgres = await this.pool.connect();
    try {
      await postgres.query(
        "insert into otp(email,number,otp,isVerified) values($1,$2,$3,$4)",
        [email, number, otp, false]
      );
      postgres.release();
      return true;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  updateOtp = async (number, email, isVerified) => {
    var postgres = await this.pool.connect();
    try {
      await postgres.query(
        "update otp set isverified=$3 where (email=$1 or number = $2)",
        [email, number, isVerified]
      );
      postgres.release();
      return true;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  deleteOtp = async (number, email) => {
    var postgres = await this.pool.connect();
    try {
      await postgres.query(
        "delete from table where (email = $1 or number = $"[(email, number)]
      );
      postgres.release();
      return true;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };
};
