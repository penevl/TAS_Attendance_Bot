import gamedig from"gamedig"

import dotenv from"dotenv"
dotenv.config()

import { google } from"googleapis" 

import moment from'moment'
import logger from"./logger.js"

import {schedule} from "node-cron"

logger.setLoggingLevel(process.env.LOG_LEVEL);
logger.setLogFileLocation(process.env.LOG_LOCATION)

logger.info("Reading CRON_WAIT_BETWEEN_SCAN")
const CRON_WAIT_BETWEEN_SCAN = process.env.CRON_WAIT_BETWEEN_SCAN
logger.info("CRON_WAIT_BETWEEN_SCAN read successfuly")
logger.debug("CRON_WAIT_BETWEEN_SCAN is: " + CRON_WAIT_BETWEEN_SCAN)


logger.info("Reading CRON_WAIT_BETWEEN_SUCCESSFUL_SCAN")
const CRON_WAIT_BETWEEN_SUCCESSFUL_SCAN = process.env.CRON_WAIT_BETWEEN_SUCCESSFUL_SCAN
logger.info("CRON_WAIT_BETWEEN_SUCCESSFUL_SCAN read successfuly")
logger.debug("CRON_WAIT_BETWEEN_SUCCESSFUL_SCAN is: " + CRON_WAIT_BETWEEN_SUCCESSFUL_SCAN)

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

schedule(CRON_WAIT_BETWEEN_SCAN,() => {

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
        logger.debug("Player " + player +" added to ")
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
    waitForOpEnd();

  }else{
    logger.info("Not enough players to be logged")
  }
}).catch((error) => {
    logger.error(error)
}) 

})

function logAll(){
  logEveryone()
  logAlpha()
  logBravo()
  logCharlie()
  logDelta()
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

function waitForOpEnd(){
schedule(CRON_WAIT_BETWEEN_SUCCESSFUL_SCAN,() => {
  
})
}