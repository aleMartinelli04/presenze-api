import express, {Express} from "express";
import schoolYearRouter from "./routers/school-year.js";
import classRouter from "./routers/class.js";

const port = 3000;

const server: Express = express();

server.use(express.json());

server.use("/school-year", schoolYearRouter);
server.use("/class", classRouter);

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
