import requests
from products import *
true = True
def uploadProduct(product):
    url = "https://mart.rajalakshmimart.com/deleteProduct"
    response = requests.post(
       url=url,
       headers={'key':'2021@merchant/server/key|{www.devash.tech}~merChAnT'},
       json=product
    )
    print(response.json())

# for product in products:
uploadProduct({
    "productID": 100,
    "productName": "Pongal",
    "ownerID": "rbusiness@919551574355",
    "discription": "from REC Cafe",
    "category": "breakfast",
    "price": 20,
    "discount":0,
    "isavailable": true,
    "quantity": 50,
    "imageUrl": "pongal.png",
    "availableOn": ["monday,tuesday,wednesday,thursday,friday,saturday"]
},)

