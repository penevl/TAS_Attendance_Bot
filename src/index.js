const gamedig = require("gamedig")

const dotenv = require("dotenv");
const { google } = require("googleapis");

var moment = require('moment')

dotenv.config();

console.log("Reading SERVER_IP")
const SERVER_IP = process.env.SERVER_IP;
console.log("Server IP read successfuly: " + SERVER_IP)

console.log("Reading spreadsheetId")
const spreadsheetId = process.env.SPREADSHEET_ID;
console.log("Spreadsheet id read successfuly: " + spreadsheetId)

console.log("Reading alpha members")
const ALPHA = process.env.ALPHA.split(",");
var AlphaAttended = []
console.log("Alpha members read successfuly: " + ALPHA)

console.log("Reading bravo members")
const BRAVO = process.env.BRAVO.split(",");
var BravoAttended = []
console.log("Bravo members read successfuly: " + BRAVO)

console.log("Reading charlie members")
const CHARLIE = process.env.CHARLIE.split(",");
var CharlieAttended = []
console.log("Charlie members read successfuly: " + CHARLIE)

console.log("Reading delta members")
const DELTA = process.env.DELTA.split(",");
var DeltaAttended = [];
console.log("Delta members read successfuly: " + DELTA)

var playerList = [];
const date = new Date();
// var dateTime = date.getUTCDay() + "/" + date.getUTCMonth() + "/" + date.getFullYear()
var dateTime = moment(date, "YYYY-MM-DD").add(new Date().getTimezoneOffset(),'minute').format('DD-MM-YYYY')

const auth = new google.auth.GoogleAuth({
    keyFile : "credentials.json",
    scopes : "https://www.googleapis.com/auth/spreadsheets"
})

const client = auth.getClient();

const googleSheets = google.sheets({
    version : "v4",
    auth: client
})

console.log("Quering server")
gamedig.query({
    type: 'arma3',
    host: SERVER_IP
}).then((state) => {
    console.log("Quering successful\nGetting players")
    state.players.forEach(p => {
        var player = p.name
        playerList.push(player)
        if (ALPHA.includes(player)){
            AlphaAttended.push(player)        
        }
        if (BRAVO.includes(player)){
            BravoAttended.push(player)
        }
        if (CHARLIE.includes(player)){
            CharlieAttended.push(player)
        }
        if (DELTA.includes(player)){
            DeltaAttended.push(player)
        }
    })
    console.log("Players gotten successfuly: " + playerList)
   
    googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "All!A:B",
        valueInputOption: "RAW",
        resource: {
          values: [[dateTime, playerList.toString()]],
        },
      });

      googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Alpha!A:B",
        valueInputOption: "RAW",
        resource: {
          values: [[dateTime, AlphaAttended.toString()]],
        },
      });

      googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Bravo!A:B",
        valueInputOption: "RAW",
        resource: {
          values: [[dateTime, BravoAttended.toString()]],
        },
      });

      googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Charlie!A:B",
        valueInputOption: "RAW",
        resource: {
          values: [[dateTime, CharlieAttended.toString()]],
        },
      });

      googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Delta!A:B",
        valueInputOption: "RAW",
        resource: {
          values: [[dateTime, DeltaAttended.toString()]],
        },
      });

}).catch((error) => {
    console.log(error)
});