create table users(
  name varchar,
  number varchar,
  email varchar,
  password varchar,
  id varchar primary key,
  status varchar,
  collegeID varchar unique,
  fcmToken varchar,
  balance bigint default 0
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
   isAvaliable boolean boolean default true
);

create table orders(  
  orederId bigserial,
  status varchar,
  amount bigint,
  orderdBy json,
  timestamp varchar,
  products json[],
  paymentMetadata json,
  qrToken varchar unique default gen_random_uuid(),
  isPaymentSuccessful boolean default false,
  walletAmount bigint default 0,
  deliveredAt varchar
);

create table transactions(
    transactionID bigserial,
    transactionType varchar,
    isPaymentSuccessful boolean default false,
    fromMetadata json,
    toMetadata json,
    amount bigint,
    timestamp varchar
);

create table otp(
    email  varchar unique,
    number varchar primary key,
    otp varchar,
    isVerified Boolean
);

create table recoveryOtp(
    email varchar  unique,
    number varchar primary key,
    otp varchar,
    isVerified Boolean
);

