# Instructions
## General
1. The Fetch Rewards API is deployed through Heroku. This is a repository just to view the code. 
2. The bulk of the API and logic is in "index.js". There is an additional file called "Transaction.js", which is an object representaton of a transaction.
3. The rest of the files are for configuration for Node.js and Heroku.

## Endpoint Access
1. Please use a API platform like Postman because these endpoints require request body information (cannot be accessed through Browser URL): https://www.postman.com.
2. Download this Postman collection and open in Postman to have pre-built requests ready (Add Transactions, Get Point Balance, Spend Points, Clear All Data
)
3. Endpoint Access Routes:
- Add Transactions
POST
https://fetchrewardsapi.herokuapp.com/addtransaction 
Request Body Example:
{ "payer": "DANNON", "points": 300, "timestamp": "2022-10-31T10:00:00Z" }
Response:
Successful:
{ "payer": "DANNON", "points": 300, "timestamp": "2022-10-31T10:00:00Z" }
Unsuccessful:
"Invalid transaction: Points go below 0 for this payer."

- Get Point Balance
GET
https://fetchrewardsapi.herokuapp.com/pointbalance
Response:
Successful:
{
"DANNON": 1000, 
”UNILEVER” : 0, ,
"MILLER COORS": 5300 
}

- Spend Points
PUT
https://fetchrewardsapi.herokuapp.com/spend
Request Body Example:
{ "points": 5000 }
Response:
Successful:
[
{ "payer": "DANNON", "points": -100 },
{ "payer": "UNILEVER", "points": -200 },
{ "payer": "MILLER COORS", "points": -4,700 }
]

- Clear All Data
GET
https://fetchrewardsapi.herokuapp.com/clear
Response:
Successful:
"All data has been cleared"

