const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
var axios = require('axios');


module.exports = class DailyReport{
    pool = new Pool(clientDetails);

    initCashbackOffer = async()=>{
        const eligibleList = await this.getCashbackOfferEligibleList()
        console.log(eligibleList)
        await this.creditCashback(eligibleList)
    }

    getCashbackOfferEligibleList = async()=>{
        var postgres = await this.pool.connect();
        try{
             await postgres.query(`set timezone TO 'Asia/Kolkata'`);
             var todayOrders = await postgres.query(
                `select 
                   *
                 from
                       (select
                            *
                        from 
                                    (select 
                                        sum(amount) as amount,
                                        cast(orderdby->>'id' as varchar) as id 
                                    from 
                                        orders 
                                    where 
                                        to_timestamp(timestamp, 'MM-DD-YYYY HH24:MI:SS') >= current_date - 7 and 
                                        ispaymentsuccessful is True
                                    group by 
                                        cast(orderdby->>'id' as varchar))
                                    as
                                        purchaselist
                        where
                            amount >= 300) 
                        as 
                           eligiblelist
                 left join 
                     users 
                 on 
                     eligiblelist.id = users.id;
                `
             );
             postgres.release();
             return todayOrders.rows
        }catch(error){
            postgres.release();
            console.log(error)
            return [];
        }
    }

    creditCashback = async(eligiblelist)=>{
        var postgres = await this.pool.connect();
        console.log(eligiblelist)
        try{
            for (var user in eligiblelist){
                console.log(user)
                const spendedAmount = eligiblelist[user]["amount"]
                const cashbackAmount = parseInt(spendedAmount * 0.1)
                const userID = eligiblelist[user]["id"]
                const email = eligiblelist[user]["email"]
                const balance = eligiblelist[user]["balance"]
                console.log(spendedAmount,cashbackAmount,userID,email,balance)
                await postgres.query(
                    `update users set balance = balance + $1 where id = $2`,
                    [cashbackAmount, userID]
                )
                this.sendMailToUser(email,balance,spendedAmount,cashbackAmount)
            }
            postgres.release();
        }catch(error){
            postgres.release();
            console.log(error)
        }
    }

    sendMailToUser = async(email,balance,spendedAmount,cashbackAmount)=>{
        try{
            axios.post('http://email:8000/sendMail',{
                subject:"Congratulations!",
                body:`<p>
                        You have done it! Based on your purchase history of last week, 
                        a cashback of ₹${cashbackAmount}/- has been successful credited to your rMart wallet Balance. 
                        Now enjoy ordering food from rMart for free using you wallet balance. 
                        You can check you wallet balance in the accounts section of the app.

                    <table style="width:100%;" >
                        <tr>
                            <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Your last week's purchase total</td>
                            <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${spendedAmount}</td>
                        </tr>
                        <tr>
                        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Cashback earned</td>
                        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${cashbackAmount}</td>
                        </tr>
                        <tr>
                        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Current wallet balance</td>
                        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${ parseInt(balance)+parseInt(spendedAmount)}</td>
                        </tr>
                    </table>

                    </p>`,
                    to:email,
            })
        }
      catch(error){
          console.log(error)
      }
    }
} 