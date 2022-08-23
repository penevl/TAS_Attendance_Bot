var dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()

var allAtendies;
var alphaAttendies;
var bravoAttendies;
var charlieAttendies;
var deltaAttendies;

app.set("view engine","ejs")

async function startWebServer(logger,all,alpha,bravo,charlie,delta,port){
    
    if(port > 0){
    app.get("/", (req,res) => {
        all.then((A) => {
            allAtendies = A.data.values
        })
        alpha.then((A) => {
            alphaAttendies = A.data.values
        })
        bravo.then((A) => {
            bravoAttendies = A.data.values
        })
        charlie.then((A) => {
            charlieAttendies = A.data.values
        })
        delta.then((A) => {
            deltaAttendies = A.data.values
        })
        logger.debug("Method accessed")
        res.render("index",{All : allAtendies,Alpha : alphaAttendies,Bravo : bravoAttendies,Charlie : charlieAttendies,Delta : deltaAttendies})
    })

    logger.info("Web server listening on port " + WEB_VIEW_PORT)
    app.listen(port)
    }else{
        return
    }
}

module.exports = {startWebServer}