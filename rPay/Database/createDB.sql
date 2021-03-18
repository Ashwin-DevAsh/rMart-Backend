create table users(
  accountname varchar,
  ownername varchar,
  number varchar,
  email varchar,
  password varchar,
  id varchar primary key,
  AccountInfo json[],
  qrCode varchar,
  isMerchantAccount boolean,
  status varchar,
  fcmToken varchar,
  balance bigint
);

-- otp

create table otp(
    number varchar primary key,
    otp varchar,
    verified Boolean
);

create table merchantsOtp(
    number varchar primary key,
    otp varchar,
    verified Boolean
);

create table recoveryOtp(
    email varchar  primary key,
    otp varchar,
    verified Boolean
);

create table recoveryMerchantsOtp(
    email varchar  primary key,
    otp varchar,
    verified Boolean
);

create table transactions(
    transactionID bigserial,
    transactionTime varchar,
    fromMetadata json,
    toMetadata json,
    amount bigint,
    isGenerated boolean,
    isWithdraw boolean,
    message varchar
);

-- block...

create table blocks(
  type varchar,
  blockID bigserial,
  refID varchar,
  encryptedData varchar,
  timestamp timestamp default current_timestamp,
  verifiedBy varchar[]
);

