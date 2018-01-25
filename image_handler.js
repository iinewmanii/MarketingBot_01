"use strict";

const fs = require("fs");
const chalk = require("chalk");
const DEBUG = require("debug")("DEBUG");

var files = fs.readdirSync("./images", { encoding: null });
DEBUG(chalk.white.bold(files));
DEBUG(chalk.white.bold(files[0]));

exports.getImage = function() {
	let image = fs.readFileSync("./images/" + files[0], { encoding: null });
	return image;
};

exports.unlinkImage = function() {
	fs.unlinkSync("./images/" + files[0]);
	DEBUG(chalk.green("Deleted file 0..."));
};
