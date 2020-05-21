var cluster = require('cluster');
var os = require('os');

if (cluster.isMaster)
{
    console.log(`Master Process ${process.pid} is running`);
    const numOfCPUs = process.env.NODE_ENV == 'production' ? os.cpus().length : 1;
    for (i=0;i<numOfCPUs;++i)
        var worker = cluster.fork();
}
else
{
    console.log(`Child Process ${process.pid} is running`);
    require('./server.js');
}