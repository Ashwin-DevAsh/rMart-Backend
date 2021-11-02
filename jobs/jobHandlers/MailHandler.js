var cron = require('node-cron');
var axios = require('axios');
var dailyReport = new (require('../Services/DailyReport'))();


var task = cron.schedule('00 17 * * *', async() => {
  console.log('task executing...')
  try{

    var todayOrders = await dailyReport.getTodayOrders()

    var totalOrders = 0;
    var pendingOredrs = 0;
    var deliveredOrders = 0;
    var productString = ``
    var productMap = {}

    for(var i in todayOrders){
      var order = todayOrders[i]
      totalOrders+=1
      if(order.status == 'pending'){
          pendingOredrs+=1
          continue;
      }else{
          deliveredOrders+=1
      }

      var order = order.products;

      for(var i in order){
        var productID = order[i].product.productID

        console.log( order[i])

        try{
          productMap[productID].productName =  order[i].product.productName;
          productMap[productID].count += order[i].count
          productMap[productID].totalPrice += order[i].totalPrice
        }catch(e){
          productMap[productID] = {
            productName : order[i].product.productName,
            count : order[i].count,
            totalPrice:order[i].totalPrice
          }
        }
      }
    }

    for( var i in productMap){
      var product = productMap[i]

      productString += `<tr> 
        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${product.productName}</td>
        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${product.count}</td>
        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${product.totalPrice} Rs</td>
      </tr>` 
    }


    axios.post('http://email:8000/sendMail',{
      subject:"Today's Report",
      body:`<p>
              No of Orders Placed :  ${totalOrders} <br/>
              Delivered Orders :    ${deliveredOrders} <br/>
              Pending Orders :      ${pendingOredrs} <br/><br/><br/>
              <table style="width:100%;" >
                <tr>
                  <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Product</th>
                  <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;">Count</th>
                  <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Amount</th>
                </tr>
                ${productString}
              </table>
           </p>`,
           to:'rmart.developers@rajalakshmi.edu.in',
    })

     console.log("sended email")
  }catch(e){
    console.log(e)
  }
},
{ 
scheduled: true,
timezone: "Asia/Kolkata"
}
);


module.exports = {task};