const redis     = require('async-redis')
const client    = redis.createClient({
    port      : 6379,              
    host      : 'redis',      
    password  : process.env.REDIS_PASSWORD,
});

client.on("error", function(error) {
    console.error(error);
});

module.exports = client;