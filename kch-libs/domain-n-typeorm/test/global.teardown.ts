module.exports = async() => {

    await globalThis.postgresContainer.stop({
        remove: true,
        timeout: 50000
    });
};