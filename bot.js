var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;
const markov = require('markov');
var fs = require('fs');
var moment = require('moment-timezone');
const config = require('./config')

module.exports = {
  twitterKeys: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }
}

// var Bot = new TwitterBot({
//  consumer_key: process.env.BOT_CONSUMER_KEY,
//  consumer_secret: process.env.BOT_CONSUMER_SECRET,
//  access_token: process.env.BOT_ACCESS_TOKEN,
//  access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
// });

var Bot = new TwitterBot({
 consumer_key: 'Qf2gQMuWfCST1b2ZKwKnr7iPF',
 consumer_secret: '5sq6lTRv1QbxKLjfFyXWhQZ9FhcfouTsbKt7aA12sDMCgjqTvQ',
 access_token: '999879340941807617-qO86BVKAci6osy4XfIt9WcWFRaSvVbF',
 access_token_secret: 'UJq9IbvWS8yFUWBaJD29WDgWeLcHlMADtwqs60jdaeHdq'
});

var chain = markov(3);

var hour = moment().tz("America/New_York").format("H")
var lyrics = null;

const tweet = () => {
    console.log("tweet")
    console.log("setting lyrics..")
    if (hour >= 6 && hour <= 18) {
        //console.log('tilian')
        // tilian
        fs.readFile('tilian.txt', 'utf8', function(err, data) {  
            if (err) throw err;
                lyrics = data;
                console.log("set lyrics to tilian")
                chain.seed(lyrics, function() {
                    console.log("making tweet")
                    try {  
                        var res = chain.respond('<Buffer 0a>', 8).join(' ');
                        Bot.tweet(res);
                        console.log(res)
                        // Bot.post('statuses/update', { status: lyrics }, function(err, data, response) {
                        //     console.log(data)
                        // })
                    } catch(e) {
                        console.log('Error:', e.stack);
                    }
                }); 
            });
    } else {
        // console.log('jon')
        //jon
        fs.readFile('jon.txt', 'utf8', function(err, data) {  
        if (err) throw err;
            lyrics = data;
            console.log("set lyrics to jon")
            chain.seed(lyrics, function() {
                console.log("making tweet")
                try {  
                    var res = chain.respond('<Buffer 0a>', 8).join(' ');
                    Bot.tweet(res);
                    console.log(res)
                    // Bot.post('statuses/update', { status: lyrics }, function(err, data, response) {
                    //     console.log(data)
                    // })
                } catch(e) {
                    console.log('Error:', e.stack);
                }
            }); 
        });
    }
}

tweet();

