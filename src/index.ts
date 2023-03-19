import express from "express";
import {fileURLToPath} from "url";
import {dirname, join} from "path";
import {glob} from "glob";

const port = 3000;

const server = express();

server.use(express.json());

async function main() {
    const path = join(dirname(fileURLToPath(import.meta.url)), "endpoints");
    let registered = 0;

    for (const file of await glob(path + "/**/*.js")) {
        if (!file.endsWith(".js")) {
            continue;
        }

        const d = await import(file);

        if (d.default) {
            const endpoint = new d.default(server);
            await endpoint.register();

            registered += 1;
        }
    }

    console.log("🥝 Registered " + registered + " endpoints!");

    server.listen(port, () => {
        console.log("🦦 API listening on port " + port);
    });
}

main();
