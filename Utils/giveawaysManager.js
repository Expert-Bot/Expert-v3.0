const { readdirSync } = require('fs');
require('colors');

module.exports = (client) => {
    if (client.giveawayConfig.giveawayManager.privateMessageInformation) {
        readdirSync('./GiveawaysEvents/').forEach(async (dir) => {
            const events = readdirSync(`./GiveawaysEvents/${dir}`).filter(file => file.endsWith('.js'));

            for (const file of events) {
                const event = require(`${__dirname}/../GiveawaysEvents/${dir}/${file}`);
                if (event.name) {
                    console.log(`[GIVEAWAYS EVENTS]`.cyan + ` Event ${file.split(".")[0]} loaded!`);
                    client.giveawaysManager.on(event.name, (...args) => event.execute(...args, client))
                    delete require.cache[require.resolve(`${__dirname}/../GiveawaysEvents/${dir}/${file}`)];
                } else {
                    console.log(`[GIVEAWAYS EVENTS]`.red + ` Failed to load event: ${file.split('.')[0]}!`);
                    continue;
                }
            }
        });
    } else {
        return console.log(`[WARNING]`.yellow + ` Private Message Information is disabled!`);
    }

}