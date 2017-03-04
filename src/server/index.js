import express from 'express'
import winston from 'winston'
import dotenv from 'dotenv'
import cons from 'consolidate'

import path from 'path'

//import { RtmClient, RTM_EVENTS, CLIENT_EVENTS } from '@slack/client'

 import Bot from './bot'

dotenv.config()


let bot = new Bot(process.env.SLACK_API_TOKEN, process.env.NAME)

bot.start()

bot.on('ready', () => {
    winston.info(`bot ready`)
})

let obvious = 'Demain est un autre jour'

bot.on('obvious', ({ message, channelId }) => {
    if (message.text !== obvious) {
        winston.info(`new obvious sentence ${message.text} from ${message.user}`)
        obvious = message.text.replace(/^\"/, '').replace(/\"$/, '')
        bot.confirm(message, channelId)
    }
})

let app = express()

app.engine('html', cons.swig)
app.disable('view cache')

// set .html as the default extension
app.set('view engine', 'html')
app.set('views', path.join(__dirname, '../../src/templates'))

app.get('/', (req, res) => {
  res.render('index', {
    obvious: obvious
  })
})

app.use(express.static(path.join(__dirname, '../../src/public')))

let server = app.listen(process.env.PORT, () => {
    winston.info(`listening on port ${server.address().port}`)
})



/*

*/

/*
let bot_token = process.env.SLACK_API_TOKEN || ''

let rtm = new RtmClient(bot_token)

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
})

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  console.log('connected')
  //rtm.sendMessage("Hello!", '#random')
})

rtm.on(CLIENT_EVENTS.REACTION_ADDED, function handleRtmReactionAdded (reaction) {
  console.log('Reaction added:', reaction)
})

rtm.on(CLIENT_EVENTS.MESSAGE, function handleRtmReactionAdded (reaction) {
  console.log('Reaction added:', reaction)
})

rtm.start()*/
