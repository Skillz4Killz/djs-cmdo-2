import Commando from 'discord.js-commando'
import path from 'path'
import * as sqlite from 'sqlite'
import sqlite3 from 'sqlite3'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '../.env') })

const client = new Commando.Client({
	commandPrefix: "ufweaihqr2389",
	owner: '130136895395987456',
	shards: "auto",
	messageCacheLifetime: 600, 
	messageSweepInterval: 300,
	ws: {
		intents: [
			"DIRECT_MESSAGE_REACTIONS",
			"DIRECT_MESSAGES",
			"GUILD_BANS",
			"GUILD_EMOJIS",
			"GUILD_INVITES",
			"GUILD_MEMBERS",
			"GUILD_MESSAGE_REACTIONS",
			"GUILD_MESSAGES",
			"GUILD_VOICE_STATES",
			"GUILDS"
		]
	}
})

client.registry

	// registers command groups
	.registerGroups([
		['main', 'Main commands'],
		['admin', 'Admin commands'],
		['bot', 'Meta commands']
	])

	// registers all built-in groups, commands, and argument types
	.registerDefaults()

	// registers all commands in the ./commands/ directory
	.registerCommandsIn(path.join(__dirname, 'commands'))

client.setProvider(
	sqlite.open({ filename: 'database.db', driver: sqlite3.Database })
		.then(db => new Commando.SQLiteProvider(db))
).catch(console.error)

client.on('ready', () => {

	console.log('Bot running!');
	console.log("Successfully connected to gateway");
	logMemory();
	setInterval(logMemory, 60000);
	
}).on("shardReady", (id) => {
	console.log(`SHARD READY`, id);

})

client.login(process.env.bottoken)

let counter = 1;
function logMemory() {
  const usage = process.memoryUsage();
  const bytes = 1000000;
  console.log(`[${counter} djs] Memory Usage RSS: ${usage.rss / bytes}MB Heap Used: ${usage.heapUsed/ bytes}MB Heap Total: ${usage.heapTotal / bytes}MB | Members ${client.users.cache.size} Guilds: ${client.guilds.cache.size}`);
  counter++;
}
