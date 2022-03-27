import requests
from products import *
true = True
def uploadProduct(product):
    url = "https://mart.rajalakshmimart.com/addProducts"
    response = requests.post(
       url=url,
       headers={'key':'2021@merchant/server/key|{www.devash.tech}~merChAnT'},
       json=product
    )
    print(response.json())

for product in products:
    uploadProduct(product)

