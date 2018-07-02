var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;
const markov = require('markov');
var fs = require('fs');
var moment = require('moment');


var Bot = new TwitterBot({
 consumer_key: process.env.BOT_CONSUMER_KEY,
 consumer_secret: process.env.BOT_CONSUMER_SECRET,
 access_token: process.env.BOT_ACCESS_TOKEN,
 access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});

var chain = markov(3);

var hour = moment().tz("America/New_York").format("H")
var lyrics = '';

if (hour >= 6 && hour <= 18) {
    // tilian
    fs.readFile('tilian.txt', 'utf8', function(err, data) {  
    if (err) throw err;
        lyrics = data;
        Bot.tweet(lyrics);
    });
} else {
    //jon
    fs.readFile('jon.txt', 'utf8', function(err, data) {  
    if (err) throw err;
        lyrics = data;
        Bot.tweet(lyrics);
    });
}