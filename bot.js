"use strict";

const chalk = require("chalk");
const DEBUG = require("debug")("DEBUG");

DEBUG(chalk.magenta.bold("MarketingBot_01 is starting..."));

const myTwitterModule = require("./twitter_module");
const imageHandler = require("./image_handler");

// const RUN_INTERVAL = 1000 * 60 * 60 * 4;

// //////////////////// PKT SOCIAL MEDIA BOT ///////////////////////////////////

// Start the bot
main();

// Repeatedly run the bot on an interval
// setInterval(main, RUN_INTERVAL);

function main() {
	DEBUG(chalk.white("Starting MAIN function..."));

	// let image = imageHandler.getImage();

	// ///////////////// START TWITTER BOT /////////////////////////////////////
	DEBUG(chalk.white("Twitter function starting..."));

	myTwitterModule.twitterBot();
	myTwitterModule.listen();

	// imageHandler.unlinkImage();
}
