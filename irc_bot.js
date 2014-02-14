// Create the configuration
var config = {
	channels: ["#appacademy"],
	server: "irc.foonetic.net",
	botName: "CreatorBot"
};

// Get the lib
var irc = require("irc");
var _ = require("underscore");

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

childBots = {}

var getChildBot = function(string){
	var bot = /(\S*Bot)/.exec(string)
	if (typeof bot === 'undefined' || bot === null){
		return null
	} else {
		return childBots[bot[1]]
	}
}

bot.addListener("message", function(from, to, text, message) {
	if (text.match(/DC/) && text.match(/sucks/)){
		bot.say(from, "your place of origin resembles an unwashed taint.")
	};


	if (text === "shut up CreatorBot, you're drunk"){
		bot.say(config.channels[0], "Fuck all of you.")
		bot.part("#appacademy")
	};

	if (text.match(/make/)){
		var regexp = /(make)\s(\w*)(Bot)/
		var match = regexp.exec(text)
		if (match !== null && match[3] === "Bot"){
			makeBot(match[2])
		}
	}
	
});

var whitelist = ["jnoble", "nathan", "rory", "pompey"]

var makeBot = function(name) {
	var newConfig = {
	channels: ["#appacademy"],
	server: "irc.foonetic.net",
	botName: name + "Bot"
}
	var newbot = new irc.Client(newConfig.server, newConfig.botName, {
		channels: newConfig.channels
	});

	childBots[newConfig.botName] = newbot

	newbot.addListener("message", function(from, to, text, message) {
		if (text.match(/kill/) && _.contains(whitelist, from)) {
			var child = getChildBot(text)
			if (child !== null) {
				child.say(newConfig.channels[0], "Fuck all of you.")
				child.part("#appacademy")
			}
		};


		if (text.match(/Bot/) && text.match(/say/)) {
			regex = /(say)\s(.*)\s(when)\s(.*)/
			match = regex.exec(text)
			if (match !== null && match[2] !== null ) {
				var child = getChildBot(text)
				if (child !== null) {
					child.addListener("message", function(from, to, text, message) {
						say = match[2]
						on = new RegExp(match[4])
						if (text.match(on) && !from.match(/Bot/)){
							newbot.say(newConfig.channels[0], say)
						}
					})
				}
			}
		}
	})
};