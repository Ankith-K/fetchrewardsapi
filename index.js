// Port number.
const port = process.env.PORT || 8080;

// Required imports for express.
const express = require("express");
const app = express();

// App uses express middleware to read json.
app.use(express.json());

// Uses the Transaction object (holds payer, points, timestamp).
const Transaction = require('./Transaction.js');
const { getSystemErrorMap } = require("util");

// List of transaction objects.
let transactions = [];
// Holds the number of points per company.
let companies = new Map();

// Endpoint to get point balance per company.
app.get("/pointbalance", (req, res) => {
    jsonString = '{\n'

    // Iterates through company map to build a string.
    for (let [key, value] of companies) {
        jsonString = jsonString + key + ' : ' + value + ',\n' 
    }

    jsonString = jsonString + '}';

    // Returns string.
    res.send(jsonString);
});


// Endpoint for adding a transaction to "database" (list, map).
app.post("/addtransaction", (req, res) =>  {

    // Extract payer, points, and timestamp from request body.
    const payer = req.body.payer;
    const points = req.body.points;
    const timestamp = req.body.timestamp;

    // Add points to the company map. If company does not exist, create 
    // new entry in map with points. Else, add points to exisiting points.
    if(companies.has( payer)){
        currPoints = companies.get(payer);
        totalPoints = currPoints + points
        // Don't add transaction because this causes payer's points to go negative.
        if(totalPoints < 0){
            res.send("Invalid transaction: Points go below 0 for this payer.");
            return;
        }
        companies.set(payer, totalPoints);
    }
    else{
        // Don't add transaction because this causes payer's points to go negative.
        if(points < 0){
            res.send("Invalid transaction: Points go below 0 for this payer.");
            return;
        }
        companies.set(payer, points);
    }

    // Create transaction body and append to list.
    let tempTransaction = new Transaction(payer, points, timestamp);
    transactions.push(tempTransaction);

    // Create return json and return.
    json = {"payer": payer, "points": points, "timestamp": timestamp}
    res.send(json);
});

// Endpoint for spending points.
app.put("/spend", (req, res) =>  {
    // Sort transactions by timestamp.
    transactions.sort(compare);

    let spend = req.body.points;
    
    // Make mini map to hold how much each company account dropped. Start value at 0.
    let minimap = new Map();
    for (let [key, value] of companies) {
        minimap.set(key, 0);
    }

    // Iterate through each transaction.
    for(t of transactions){

        // Get the payer and points for this transaction.
        payer = t.getPayer();
        points = t.getPoints();

        // Variable to decide how much to spend from this transaction.
        let toSpend = 0;

        // Boolean to check if we are about to finish spending points.
        let tf = false;

        // Boolean to check if spending total is more or current 
        // transaction points is more.
        // If total spend is more, then we assign the amount of points to 
        // spend to the current transaction points.
        // If total spend is less, then we assign the amount of points to 
        // spend to the total spend.
        // This ensures, on the last iteration, we are spending the correct 
        // amount.
        if(spend > points){
            toSpend = points;
        }
        else{
            toSpend = spend;
            tf = true;
        }

        // Subtract current iteration spending points from total spend.
        spend = spend - toSpend;        

        // Subtract current spending points from total points for the current company.
        mapPoints = companies.get(payer);
        companies.set(payer, mapPoints - toSpend);

        // Add points to the minimap to account for the difference in point balance 
        // per company.
        minimapPoints = minimap.get(payer);
        minimap.set(payer, minimapPoints + (toSpend * -1));

        // Occurs if spend total is less than current spending iteration (on the last 
        // iteration).
        if(tf){
            break;
        }
    }

    // Create list of minimap.
    returnMiniMap = []
    for (let [key, value] of minimap) {
        returnMiniMap.push({"payer": key, "points": value});
    }

    // Return minimap.
    res.send(returnMiniMap);
    
});

// Endpoint for spending points.
app.get("/clear", (req, res) =>  {
    transactions = [];
    companies = new Map();
    res.send("All data has been cleared.");
});

// Sorts transaction objects by timestamp.
function compare( a, b ) {
    if ( a.getTimestamp() < b.getTimestamp() ){
      return -1;
    }
    if ( a.getTimestamp() > b.getTimestamp() ){
      return 1;
    }
    return 0;
}

// Begin server.
app.listen(
    port,
    () => console.log(`Server is live on http://localhost:${port}`)
)