import {Endpoint} from "./endpoint.js";
import {Request, Response} from "express";

export default class PingEndpoint extends Endpoint {
    readonly path = "/ping";
    readonly validators = [];

    protected async _get(req: Request, res: Response): Promise<any> {
        res.json({ping: "pong"});
    }
}