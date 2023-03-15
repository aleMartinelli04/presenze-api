import express, {Express} from "express";

const port = 3000;

const server: Express = express();

async function main() {
    try {
        await server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
