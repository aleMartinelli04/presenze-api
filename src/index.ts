import fastify from 'fastify'

const port = 3000;

const startServer = async () => {
    try {
        const server = fastify({
            logger: true,
        });

        server.setErrorHandler((error, _, __) => {
            server.log.error(error);
        })

        server.get('/', (request, reply) => {
            reply.send({name: 'fastify-typescript'});
        })

        await server.listen({port: port, host: '0.0.0.0'});
    } catch (e) {
        console.error(e)
    }
}

startServer().then(() => {
    console.log(`Server started on port ${port}`);
});
