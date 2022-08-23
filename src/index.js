var logger = require("./logger")

var dotenv = require("dotenv")
dotenv.config()

const gamedig = require("gamedig")

var {google} = require("googleapis") 

var moment = require('moment')

var cron = require("node-cron")

const {startWebServer} = require("./website")



logger.setLoggingLevel(process.env.LOG_LEVEL);
logger.setLogFileLocation(process.env.LOG_LOCATION)

logger.info("Reading CRON_WAIT_BETWEEN_SCAN")
const CRON_WAIT_BETWEEN_SCAN = process.env.CRON_WAIT_BETWEEN_SCAN
logger.info("CRON_WAIT_BETWEEN_SCAN read successfuly")
logger.debug("CRON_WAIT_BETWEEN_SCAN is: " + CRON_WAIT_BETWEEN_SCAN)

logger.info("Reading WEB_VIEW_PORT")
const WEB_VIEW_PORT = process.env.WEB_VIEW_PORT;
logger.info("WEB_VIEW_PORT read successfuly")
logger.debug("WEB_VIEW_PORT is: " + WEB_VIEW_PORT)

logger.info("Reading SERVER_IP")
const SERVER_IP = process.env.SERVER_IP 
logger.info("Server IP read successfuly")
logger.debug("Server ip is: " + SERVER_IP)

logger.info("Reading MIN_PLAYERS")
const MIN_PLAYERS = process.env.MIN_PLAYERS
logger.info("MIN_PLAYERS read successfuly")
logger.debug("MIN_PLAYERS are " + MIN_PLAYERS)

logger.info("Reading spreadsheetId")
const spreadsheetId = process.env.SPREADSHEET_ID 
logger.info("Spreadsheet id read successfuly")
logger.debug("Spreadsheet id is: "  + spreadsheetId)

logger.info("Reading alpha members")
const ALPHA = process.env.ALPHA.split(",") 
var AlphaAttended = []
logger.info("Alpha members read successfuly")
logger.debug("Alpha members are: "  + ALPHA)

logger.info("Reading bravo members")
const BRAVO = process.env.BRAVO.split(",") 
var BravoAttended = []
logger.info("Bravo members read successfuly")
logger.debug("Bravo members are: " + BRAVO)

logger.info("Reading charlie members")
const CHARLIE = process.env.CHARLIE.split(",") 
var CharlieAttended = []
logger.info("Charlie members read successfuly")
logger.debug("Charlie members are: "  + CHARLIE)

logger.info("Reading delta members")
const DELTA = process.env.DELTA.split(",") 
var DeltaAttended = [] 
logger.info("Delta members read successfuly")
logger.debug("Delta members are: "  + DELTA)

var playerList = [] 
const date = new Date() 
var dateTime = moment(date, "YYYY-MM-DD").add(new Date().getTimezoneOffset(),'minute').format('DD-MM-YYYY')
var shouldScan = true;

logger.info("Creating google auth object")
const auth = new google.auth.GoogleAuth({
    keyFile : "credentials.json",
    scopes : "https://www.googleapis.com/auth/spreadsheets"
})
logger.info("Creating google auth object successful")

logger.info("Creating google client object")
const client = auth.getClient() 
logger.info("Creating google client object successful")

logger.info("Creating googleSheets object")
const googleSheets = google.sheets({
    version : "v4",
    auth: client
})

logger.info("googleSheets object created successfuly")
var playerCount;

startWebServer(logger,getAllAttendance(),getAlphaAttendance(),getBravoAttendance(),getCharlieAttendance(),getDeltaAttendance(),WEB_VIEW_PORT)

if(shouldScan){

cron.schedule(CRON_WAIT_BETWEEN_SCAN,() => {

logger.info("Quering server")
gamedig.query({
    type: 'arma3',
    host: SERVER_IP
}).then((state) => {
    logger.info("Quering successful")
    logger.info("Getting players")
    playerCount = state.players.length;
    logger.debug("Player count is " + playerCount)
    if(playerCount > MIN_PLAYERS){
    state.players.forEach(p => {
        var player = p.name
        playerList.push(player)
        logger.debug("Player " + player +" added to playerList")
        if (ALPHA.includes(player)){
            AlphaAttended.push(player)
            logger.debug("Player " + player +" added to ALPHA")        
        }
        if (BRAVO.includes(player)){
            BravoAttended.push(player)
            logger.debug("Player " + player +" added to BRAVO")
        }
        if (CHARLIE.includes(player)){
            CharlieAttended.push(player)
            logger.debug("Player " + player +" added to CHARLIE")
        }
        if (DELTA.includes(player)){
            DeltaAttended.push(player)
            logger.debug("Player " + player +" added to DELTA")
        }
    })
    logger.info("Players gotten successfuly")

    logger.debug("Players are: "  + playerList)
    logger.debug("AlphaAttended is: " + AlphaAttended)
    logger.debug("BravoAttended is: " + BravoAttended)
    logger.debug("CharlieAttended is: " + CharlieAttended)
    logger.debug("DeltaAttended is: " + DeltaAttended)

    logAll();
    waitForMissionEnd();

  }else{
    logger.info("Not enough players to be logged")
  }
}).catch((error) => {
    logger.error(error)
}) 

})

}

function logAll(){
  logEveryone()
  logAlpha()
  logBravo()
  logCharlie()
  logDelta()
}

function waitForMissionEnd(){
  logger.info("shouldScan set to false")
  shouldScan = false
  cron.schedule("* 23 * * * *",() => {
    shouldScan = true
    logger.info("shouldScan set to true")
  })
}

function logEveryone(){

  googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "All!A:B",
    valueInputOption: "RAW",
    resource: {
      values: [[dateTime, playerList.toString()]],
    },
  })
  logger.info("All players logged to google sheets")

}

function logAlpha(){

  googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Alpha!A:B",
    valueInputOption: "RAW",
    resource: {
      values: [[dateTime, AlphaAttended.toString()]],
    },
  }) 
  logger.info("All players from AlphaAttended logged to google sheets")

}

function logBravo(){

  googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Bravo!A:B",
    valueInputOption: "RAW",
    resource: {
      values: [[dateTime, BravoAttended.toString()]],
    },
  })
  logger.info("All players from BravoAttended logged to google sheets")

}

function logCharlie(){

  googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Charlie!A:B",
    valueInputOption: "RAW",
    resource: {
      values: [[dateTime, CharlieAttended.toString()]],
    },
  })
  logger.info("All players from CharlieAttended logged to google sheets")

}

function logDelta(){

  googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Delta!A:B",
    valueInputOption: "RAW",
    resource: {
      values: [[dateTime, DeltaAttended.toString()]],
    },
  }) 
  logger.info("All players from DeltaAttended logged to google sheets")

}

async function getAllAttendance() {

  return googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "All!A:B",
  })

}

async function getAlphaAttendance() {

  return googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Alpha!A:B",
  })

}

async function getBravoAttendance() {

  return googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Bravo!A:B",
  })

}

async function getCharlieAttendance() {

  return googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Charlie!A:B",
  })

}

async function getDeltaAttendance() {

  return googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Delta!A:B",
  })

}