export default async function globalTeardown() {
    if (global.nestApp) {
        await global.nestApp.close();  
    }
    
    if (global.postgresContainer) {
        await global.postgresContainer.stop({
            remove: true,
            timeout: 50000
        });
    }

    if (global.redisContainer) {
        await global.redisContainer.stop({
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