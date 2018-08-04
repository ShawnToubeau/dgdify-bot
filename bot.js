var Twit = require('twit');
var fs = require('fs');
require('dotenv').config();
var moment = require('moment-timezone');
var hour = moment().tz("America/New_York").format("H")
var order = 4;
var nGrams = {};

var Bot = new Twit({
 consumer_key: process.env.TWITTER_CONSUMER_KEY,
 consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
 access_token: process.env.TWITTER_ACCESS_TOKEN,
 access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

function selectLyrics() {
    if (hour >= 6 && hour <= 18) {
        fs.readFile('tilian.txt', 'utf8', function(err, lyrics) {  
            if (err) throw err;
                tweet(lyrics);
        });
    } else {
        fs.readFile('jon.txt', 'utf8', function(err, lyrics) {  
            if (err) throw err;
                tweet(lyrics);
        });
    }
}

function getTweetStart(lyrics) {
    var random = Math.floor(Math.random()*lyrics.length)
    return lyrics.substring(random, random + order)
}

function makeEngramTable(lyrics) {
    for (var i = 0; i < lyrics.length - order; i++) {
        var gram = lyrics.substring(i, i + order);

        if (!nGrams[gram]) {
            nGrams[gram] = [];
        }
        nGrams[gram].push(lyrics.charAt(i + order));
    }
}

function tweet(lyrics) {
    makeEngramTable(lyrics);
    var currentGram = getTweetStart(lyrics);

    while (!currentGram.match(/^[0-9a-zA-Z]+$/)) {
        currentGram = getTweetStart(lyrics);
    }
    var tweet = currentGram;

    for (var j = 0; j < 150; j++) {
        var possibilities = nGrams[currentGram];
        var next = possibilities[Math.floor(Math.random()*possibilities.length)];
        tweet += next;
        var len = tweet.length;
        currentGram = tweet.substring(len-order, len);
    }
    console.log(tweet)
    Bot.post('statuses/update', {status: tweet}, function(error, tweet, response) {
        if (error) throw error;
        // console.log(tweet)
    });
}

selectLyrics();