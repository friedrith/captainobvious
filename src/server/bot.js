import SlackBot from 'slackbots'
import EventEmitter from 'events'
import Slack from 'slack-node'

// import winston from 'winston'

class Bot extends EventEmitter {

    constructor (token, name) {
        super()
        this.config = { name: name, token: token }
        this.name = name
        this.slack = new Slack(token)
    }

    start () {

        let reactionVote = '+1'
        console.log('started')
        this.bot = new SlackBot(this.config)
        this.bot.on('start', () => this.emit('ready'))
        this.bot.on('message', (message) => {
            if (message.type === 'reaction_added' && message.reaction === reactionVote) {
                // console.log('+1', message.item.ts)
                this.slack.api("reactions.get", { timestamp: message.item.ts, channel: message.item.channel, ts: message.item.ts, full: true }, (err, response) => {
                //   console.log(err, response)
                  if (!err && response.message && response.message.reactions) {
                      for (let reaction of response.message.reactions) {
                          console.log(reaction)
                          if (reaction.name === reactionVote && reaction.count >= process.env.VOTES) {
                              this.emit('obvious', response.message)
                          }
                      }
                  }
                })
            }
        })
    }

}

export default Bot
