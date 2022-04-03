import requests
from products import *
true = True
def uploadProduct(product):
    url = "https://mart.rajalakshmimart.com/updateProduct"
    response = requests.post(
       url=url,
       headers={'key':'2021@merchant/server/key|{www.devash.tech}~merChAnT'},
       json=product
    )
    print(response.json())

uploadProduct({
        "productID": 1,
        "productName": "Pongal",
        "ownerID": "rbusiness@919704755328",
        "discription": "from REC Cafe",
        "category": "breakfast",
        "price": 20,
        "discount": 0,
        "isavailable": true,
        "quantity": 50,
        "imageUrl": "pongal.png",
        "availableOn": ["monday,tuesday,wednesday,thursday,friday,saturday"]
    })

