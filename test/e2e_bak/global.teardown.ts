module.exports = async() => {
    
    if (globalThis.nestApp) {
        await globalThis.nestApp.close();  
    }
    
    if (globalThis.postgresContainer) {
        await globalThis.postgresContainer.stop({
            remove: true,
            timeout: 50000
        });
    }

    if (globalThis.redisContainer) {
        await globalThis.redisContainer.stop({
            remove: true,
            timeout: 50000
        });
    }
};


// module.exports = async() => {

//     await globalThis.postgresContainer.stop({
//         remove: true,
//         timeout: 50000
//     });

//     await globalThis.redisContainer?.stop({
//         remove: true,
//         timeout: 50000
//     });
// };