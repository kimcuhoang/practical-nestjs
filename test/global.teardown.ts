module.exports = async() => {

    await globalThis.nestApp?.close();

    await globalThis.postgresContainer.stop({
        remove: true,
        timeout: 50000
    });

    await globalThis.redisContainer?.stop({
        remove: true,
        timeout: 50000
    });
};