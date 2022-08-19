# TAS_Attendance_Bot
A bot that checks who was in a given operation during the time the bot was ran and writes that down to a google sheets file. The bot can also check if the person was in a given squad and write that down as on a seperate google sheets sheet thus creating a squad attendance sheet.

# Instructions
## Setting the environment variables
### `LOG_LEVEL`
The log level environment variable can be set to either `debug`, `info`, `warn`, `error`. It is recommended to set this variable to `info`.
### `LOG_LOCATION`
The `LOG_LOCATION` variable is the place where all the log files will be stored. It can be either left emty and that will stop all logging activity or you can give it an absolute path and all the log files will be stored in that location
### `SERVER_IP`
The IP of the server
### `ALPHA, BRAVO, CHARLIE, DELTA`
If a player is asigned to a squad in-game if you put their exact in-game username in one of the variables that will cause the script to log their attendace on a separate sheet along with the attendance of everyone else. You can seperate each person with a comma.
