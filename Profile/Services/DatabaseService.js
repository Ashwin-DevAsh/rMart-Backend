const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");

module.exports = class Database {
  pool = new Pool(clientDetails);

  insertUser = async (
    name,
    email,
    phoneNumber,
    id,
    hashedPassword,
    collegeID
  ) => {
    var postgres = await this.pool.connect();
    try {
      await postgres.query(
        "insert into users(name,email,number,id,password,collegeID) values($1,$2,$3,$4,$5,$6)",
        [name, email, phoneNumber, id, hashedPassword, collegeID]
      );
      postgres.release();
      return true;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  changePasswordForUser = async (email, phoneNumber, hashedPassword) => {
    var postgres = await this.pool.connect();
    try {
      var user = await postgres.query(
        "update users set password = $3 where (email = $1 or number = $2) returning *",
        [email, phoneNumber, hashedPassword]
      );
      postgres.release();
      return user.rows;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
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
      return [];
    }
  };

  getOtp = async (number, email, otp) => {
    console.log(number, email, otp);
    var postgres = await this.pool.connect();
    try {
      var otpDatas = await postgres.query(
        "select * from otp where ( email = $1 or number = $2 ) and otp = $3",
        [email, number, otp]
      );
      postgres.release();
      return otpDatas.rows;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };

  getRecoveryOtp = async (number, email, otp) => {
    console.log(number, email, otp);
    var postgres = await this.pool.connect();
    try {
      var otpDatas = await postgres.query(
        "select * from recoveryOtp where ( email = $1 or number = $2 ) and otp = $3",
        [email, number, otp]
      );
      postgres.release();
      return otpDatas.rows;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };

  getVerifiedRecoveryOtp = async (number, email) => {
    console.log(number, email);
    var postgres = await this.pool.connect();
    try {
      var otpDatas = await postgres.query(
        "select * from recoveryOtp where ( email = $1 or number = $2 ) and isVerified = true",
        [email, number]
      );
      postgres.release();
      return otpDatas.rows;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
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

  insertRecoveryOtp = async (number, email, otp) => {
    var postgres = await this.pool.connect();
    try {
      await postgres.query(
        "insert into recoveryOtp(email,number,otp,isVerified) values($1,$2,$3,$4)",
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

  updateRecoveryOtp = async (number, email, isVerified) => {
    var postgres = await this.pool.connect();
    try {
      await postgres.query(
        "update recoveryOtp set isverified=$3 where (email=$1 or number = $2)",
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
        "delete from otp where (email = $1 or number = $2)",
        [email, number]
      );
      postgres.release();
      return true;
    } catch (e) {
      postgres.release();
      console.log(e);
      return false;
    }
  };

  deleteRecoveryOtp = async (number, email) => {
    var postgres = await this.pool.connect();
    try {
      await postgres.query(
        "delete from recoveryOtp where (email = $1 or number = $2)",
        [email, number]
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
