"use strict";

const chalk = require("chalk");
const DEBUG = require("debug")("DEBUG");
const fs = require("fs");
const Twit = require("twit");
const config = require("./config.js");
const queries = require("./queries.js");

const Twitter = new Twit(config);

const PKT_GOOGLE_URL = "https://play.google.com/store/apps/details?id=com.professionalkitchentimer.iinewmanii.professionalkitchentimer&hl=en";

exports.twitterBot = function() {
	// Query Twitter
	// Twitter.get('search/tweets', queries.kitchen_timer_query, interact);
	Twitter.get("search/tweets", queries.hashtag_baking_query, interact);
	// Twitter.get('search/tweets', queries.hashtag_pastry_query, favorite);
	// Twitter.get('search/tweets', queries.hashtag_baking_query, favorite);

	function interact(err, data) {
		retweet(err, data);
		// favorite(err, data);
		// replySpamLink(err, data);
		DEBUG(chalk.white("Twitter function ending..."));
	}

	// Retweets can be used most aggressively of all the Twitter functions
	function retweet(err, data) {
		var tweets = data.statuses,
			length = tweets.length;

		if (err) {
			DEBUG(chalk.red.bold(err));
		} else {
			for (let i = 0; i < length; i++) {
				// These three variables are for testing and can be
				// commented out for production.
				let name = tweets[i].user.name;
				let screen_name = tweets[i].user.screen_name;
				let text = tweets[i].text;
				let retweetId = tweets[i].id_str;

				DEBUG(
					chalk.green.bold(name + ": ") +
						chalk.green("@" + screen_name + ": ") +
						text
				);

				// Twitter.post("statuses/retweet/:id", { id: retweetId },
				//     function postRetweet(err,response) {
				//         if (err) {
				//             DEBUG(chalk.red.bold(err));
				//         }
				//         else {
				//             DEBUG(chalk.green('RETWEETED!... Success!!!'));
				//         }
				//     }
				// );
			}
		}
	}

	// Twitter very much frowns upon automated favoriting
	// Use with caution
	function favorite(err, data) {
		var tweets = data.statuses;
		var length = tweets.length;

		if (err) {
			DEBUG(chalk.red.bold(err));
		} else {
			for (let i = 0; i < length; i++) {
				// These three variables are for testing and can be
				// commented out for production.
				let name = tweets[i].user.name;
				let screen_name = tweets[i].user.screen_name;
				let text = tweets[i].text;

				if (typeof tweets == "undefined") {
					DEBUG("Error: No tweets to favorite");
				} else {
					DEBUG(
						chalk.green.bold(name + ": ") +
							chalk.green("@" + screen_name + ": ") +
							text
					);

					if (favorited) {
						DEBUG(chalk.red.bold("Error: Tweet has previously been favorited"));
					} else {
						// Twitter.post('favorites/create', { id: tweets[i].id_str },
						// 	function postFavorite(err,response) {
						// 		if (err) {
						// 			DEBUG(chalk.red.bold(err));
						// 		}
						// 		else {
						// 			DEBUG(chalk.green('FAVORITED!... Success!!!'));
						// 		}
						// 	}
						// );
					}
				}
			}
		}
	}

	// Automated replies are also very frowned upon
	// Use with caution
	function replySpamLink(err, data) {
		var tweets = data.statuses;
		var length = tweets.length;

		if (err) {
			DEBUG(chalk.red.bold(err));
			return;
		} else {
			for (let i = 0; i < length; i++) {
				// These three variables are for testing and can be
				// commented out for production.
				let name = tweets[i].user.name;
				let screen_name = tweets[i].user.screen_name;
				let text = tweets[i].text;

				let retweet_count = tweets[i].retweet_count;
				let favorite_count = tweets[i].favorite_count;

				if (typeof tweets == "undefined") {
					DEBUG(chalk.red.bold("ERROR: No tweets to spam"));
					return;
				} else if (retweet_count > 0 || favorite_count > 0) {
					// Code to post link in comments
					DEBUG(
						chalk.green.bold(name + ": ") +
							chalk.green("@" + screen_name + ": ") +
							text
					);

					Twitter.post(
						"statuses/update",
						{in_reply_to_status_id: "" + tweets[i].id_str,
							status: "@" + screen_name + " Check out our timer app: " + url},
						function postLink(err, response) {
							if (err) {
								DEBUG(chalk.red.bold(err));
								return;
							} else {
								DEBUG(chalk.green("SPAMMED LINK... Success!!!"));
							}
						}
					);
				}
			}
		}
	}
};

exports.postStatusWithImage = function(image) {
	DEBUG("Uploading Media...");

	Twitter.post("media/upload", { media: image }, function mediaUploaded(err, data, response) {
		if (err) {
			DEBUG(chalk.red.bold(err));
		} else {
			DEBUG(chalk.blue(data.media_id_string));
			// Twitter.post('statuses/update', {status: 'TESTING. Yummy!', media_ids: data.media_id_string},
			//     function mediaPosted(err, data,response) {
			//         if (err) {
			//             DEBUG(chalk.red.bold(err));
			//         }
			//         else {
			//             DEBUG(chalk.green('MEDIA POSTED... Success!!!'));
			//         }
			//     }
			// );
		}
	});
};

exports.listen = function() {
	var userStream = Twitter.stream("user");

	DEBUG(chalk.white("Twitterbot is listening..."));
	userStream.on("follow", followed);
	userStream.on("direct_message", direct_message_response);

	function direct_message(event) {
		var name = event.source.name;
		var screenName = event.source.screen_name;

		
	}
	
	function followed(event) {
		DEBUG(chalk.white("Follow event is running..."));
        var name = event.source.name;
        var screenName = event.source.screen_name;

        statusUpdate("@" + screenName +
            " Thank you for the follow! Be sure to check out Professional Kitchen Timer on Google Play. " +
            PKT_GOOGLE_URL);
	}

	function statusUpdate(tweetText) {
		var tweet = {
			status: tweetText
		};

		Twitter.post("statuses/update", tweet, function(err, data, response) {
			if (err) {
				DEBUG(chalk.red.bold(err));
			} else {
				DEBUG(chalk.green("Responded to follow by " + screenName));
			}
		});
	}

	function direct_message_response() {
		
	}
};
