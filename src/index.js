"use strict";
const port = 3000;
const server = require('fastify')({
    logger: true
});
async function main() {
    try {
        await server.listen({ host: '0.0.0.0', port: 3000 });
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
main();
