const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const { Server } = require('sonofs');

const cfg = {
    groupId: 1,
    serverId: 1,
    root: '/data/files/backup1',
    port: 8125,
    isSlave: true,
    registry: {
        port: 8123
    }
};

if (cluster.isMaster) {
    Server.start(cfg, () => {
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
    });
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`, code, signal);
    });
} else {
    Server.childThread(cfg);
}