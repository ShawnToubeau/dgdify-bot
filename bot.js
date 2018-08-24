const Twit = require('twit');
const fs = require('fs');
require('dotenv').config();

const moment = require('moment-timezone');
const hour = moment().tz("America/New_York").format("H");
const order = 5; // length of each n-gram
let nGrams = {};

const Bot = new Twit({
 consumer_key: process.env.TWITTER_CONSUMER_KEY,
 consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
 access_token: process.env.TWITTER_ACCESS_TOKEN,
 access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const getLyrics = new Promise(
    (resolve, reject) => {
        let singer = null;

        if (hour >= 6 && hour <= 18) {
            singer = 'tilian';
        } else {
            singer = 'jon';
        }

        fs.readFile(`${singer}.txt`, 'utf8', function(error, lyrics) {  
            if (error) {
                reject(error.message);
            } else {
                 resolve(lyrics);  
            } 
        });
    }
);

// picks where the nGrams should start in the lyrics document
function pickRandomStart(lyrics) {
    const random = Math.floor(Math.random()*lyrics.length)
    return lyrics.substring(random, random + order)
}

function makeEngramTable(lyrics) {
    for (let i = 0; i < lyrics.length - order; i++) {
        const gram = lyrics.substring(i, i + order);

        if (!nGrams[gram]) {
            nGrams[gram] = [];
        }
        nGrams[gram].push(lyrics.charAt(i + order));
    }
}

async function tweet() {
    try {
        let lyrics = await getLyrics;
        // console.log(lyrics)

        makeEngramTable(lyrics);
        let currentGram = pickRandomStart(lyrics);

        // checks to see if the start of the tweet doesn't start 
        // with punction or special characters and ends with a space
        while (!currentGram.match(/^[0-9a-zA-Z]+$/) && currentGram.charAt(currentGram.length - 1) !== ' ') { 
            currentGram = pickRandomStart(lyrics);
        }
        let tweet = currentGram;

        // runs until char limit is reached while finishing the last word it was on
        for (let j = 0; (j < 150) || (tweet.charAt(j) !== ' '); j++) {
            const possibilities = nGrams[currentGram];
            const next = possibilities[Math.floor(Math.random()*possibilities.length)];
            tweet += next;
            const len = tweet.length;
            currentGram = tweet.substring(len-order, len);
        }
        console.log(tweet)

        Bot.post('statuses/update', {status: tweet}, function(error, tweet, response) {
            if (error) {
                console.log(error.message);
            };
        });
      }
    catch (error) {
        console.log(error.message);
    }
}

tweet();