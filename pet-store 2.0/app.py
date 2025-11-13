from flask import Flask, request, render_template, redirect, url_for,session, jsonify,send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import bcrypt
import requests
from requests.auth import HTTPBasicAuth
import os
from werkzeug.utils import secure_filename

app= Flask(__name__)                 #request=object h contains all the dta sent from client to server

db_config = {                         #ek var/object banaye or usme ye 4 cheez define kiye      
    'host': '127.0.0.1',           #ye charo chiz compul h for connecting
    'user': 'root',                          #ye charo cheez syntax mein hai
    'password': 'Afifa@123456',                     #ye hamare database ka password h 
    'database': 'tutortime',                            #tutortime apne database  ka naam h 
}
app.secret_key = 'afifa'
   

### if record of order details are not required.###########
@app.route('/payment/', methods=['GET', 'POST'])         
def red_payments():
    data = request.args.to_dict(flat=False)
    print(f"data:{data}")
    return render_template('payment.html',data=data) 
###########################################################

########use this code if order details are needed.#############
"""@app.route('/recordPayment/', methods=['GET', 'POST'])         
def red2_payments():
    data = request.args.to_dict(flat=False)
    # print(f"data:{data}")
    return render_template('recordPayment.html', data=data) 

@app.route("/payments/<order_id>/capture", methods=["POST"])
def capture_payment(order_id):  # Checks and confirms payment
    captured_payment = approve_payment(order_id)
    # print(captured_payment) # or you can do some checks from this captured data details
    # print(f"orderId:{order_id}/n")
    # print(f"payment:{captured_payment}/n")
    return jsonify(captured_payment)
def approve_payment(order_id):
    api_link = f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{order_id}/capture"
    client_id = "YOUR_CLIENT_ID_HERE"
    secret = "YOUR_SECRET_KEY_HERE"
    basic_auth = HTTPBasicAuth(client_id, secret)
    headers = {
        "Content-Type": "application/json",
    }
    response = requests.post(url=api_link, headers=headers, auth=basic_auth)
    response.raise_for_status()
    json_data = response.json()
    # print(f"data:{json_data}")
    return json_data
###########################################################################"""


if __name__ == '__main__':
    app.run(debug=True)      