module.exports = {
  async execute(client) {
    client.on('shardReady', id => {

    client.logger(`[INFO] Shard ${id} Ready!`);
})
      }
    };
