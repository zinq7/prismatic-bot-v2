require('dotenv').config();

// Get filesystem:
const fs = require('node:fs');
// Get filepaths
const path = require('node:path');
const config = require("./config");
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, IntentsBitField } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: 
	[GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') && !file.includes("help"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


//create a new collection of commands
client.commands = new Collection();

//copied code to get all commands
const commandsPath = path.join(__dirname, 'prismatic_commands'); //get the directory folder './prismatic_commands'
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && !file.includes("help")); //read all .js files

//loop thorugh
for (const file of commandFiles) {
    //get the full path of the file
	const filePath = path.join(commandsPath, file);
	const command = require(filePath); //require it
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Log in to Discord with your client's token
client.login(config.token);
