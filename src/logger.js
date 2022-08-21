var fs = require("fs")
var moment = require('moment')

    var logDebug = false
    var logInfo = true
    var logWarning = true
    var logError = true
    var loggingEnabled = false
    var fileLocation = ""
    var fileName = getTime()
    const setLogFileLocation = (location) => { 
        fileLocation = location + "/"
        loggingEnabled = true
    }
    
    const setLoggingLevel = (level) =>{
        switch (level) {
            case "debug":
                logDebug = true
                logInfo = true
                logWarning = true
                logError = true
                break;

            case "info":
                logDebug = false
                logInfo = true
                logWarning = true
                logError = true
                break;

            case "warn":
                logDebug = false
                logInfo = false
                logWarning = true
                logError = true
                break;
            case "error":
                logDebug = false
                logInfo = false
                logWarning = false
                logError = true
                break;    
            default:
                logDebug = false
                logInfo = true
                logWarning = true
                logError = true
                break;
        }
    }
    
    const debug = (message) => {
        if(logDebug && loggingEnabled){
        console.log(getTime() + "    [DEBUG] " + message)
        fs.appendFile( "logs/" + fileName + ".log",getTime() + "    [DEBUG] " + message + "\n", function (err) {
            if (err) return console.log(err);
          });
        }
    }

    const info = (message) => {
        if(logInfo && loggingEnabled){
        console.log(getTime() +"    [INFO] " + message)
        fs.appendFile( "logs/" + fileName + ".log",getTime() +"    [INFO] " + message + "\n", function (err) {
            if (err) return console.log(err);
          });
        }
    }

    const warn = (message) => {
        if(logWarning && loggingEnabled){
        console.warn(getTime() + "    [WARNING] " + message)
        fs.appendFile( "logs/" + fileName + ".log",getTime() + "    [WARNING] " + message + "\n", function (err) {
            if (err) return console.log(err);
          });
        }
    }

    const error = (message) => {
        if(logError && loggingEnabled){
        console.log(getTime() + "    [ERROR] " + message)
        fs.appendFile( "logs/" + fileName + ".log",getTime() + "    [ERROR] " + message + "\n", function (err) {
            if (err) return console.log(err);
          });
        }  
    }

function getTime(){
    return moment(new Date(), "YYYY-MM-DD").add(new Date().getTimezoneOffset(),'minute').format('DD-MM-YYYY-H-m-s')
}    
module.exports = {setLogFileLocation,setLoggingLevel,debug,info,warn,error}