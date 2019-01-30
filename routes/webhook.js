const router = require('express').Router()
const request = require('request')

router.get('/', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.verifyToken) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Error, wrong token')
    }
})

router.post('/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging

    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id

        if (event.message && event.message.text) {
            let msg = event.message.text;
            console.log(msg);
            sendMessageData(sender, {
                text: msg
            })
        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendMessageData(sender, {
                text: "Postback received: " + text.substring(0, 200)
            })
            continue
        }

    }
    res.sendStatus(200)
})

function sendMessageData(sender, msgData) {
    const token = process.env.accessToken
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: msgData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
module.exports = router;