/// <reference path="./e2e.d.ts" />

module.exports = async() => {

    await global.postgresContainer?.stop({
        remove: true,
        timeout: 50000
    });

    await global.redisContainer?.stop({
        remove: true,
        timeout: 50000,
        removeVolumes: true
    });
};