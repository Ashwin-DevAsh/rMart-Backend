create table users(
  name varchar,
  number varchar,
  email varchar,
  password varchar,
  id varchar primary key,
  status varchar,
  fcmToken varchar
);

create table products(
   productID bigserial primary key,
   productName varchar,
   ownerID varchar,
   discription varchar,
   quantity int,  
   price bigint,
   category varchar,
   imageUrl varchar,
   availableOn varchar[],
   isAvaliable boolean,
);

create table orders(  
  orederId bigserial,
  status varchar,
  amount bigint,
  orderdBy json,
  timestamp varchar,
  products json[],
  paymentMetadata json,
  isPaymentSuccessful boolean
);


create table otp(
    email  varchar unique,
    number varchar primary key,
    otp varchar,
    isVerified Boolean
);

create table recoveryOtp(
    email varchar  primary key,
    otp varchar,
    isVerified Boolean
);
