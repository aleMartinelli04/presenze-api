import {Express, Request, Response} from "express";
import {validateMiddleware} from "../middlewares/validate.js";

export abstract class Endpoint {
    public readonly express: Express;
    abstract readonly path: string;
    abstract readonly validators: any[];

    public constructor(express: Express) {
        this.express = express;
    }

    public async register() {
        if (this._get !== Endpoint.prototype._get) {
            this.express.get(this.path, ...this.validators, validateMiddleware(), this._get.bind(this));
        }

        if (this._post !== Endpoint.prototype._post) {
            this.express.post(this.path, ...this.validators, validateMiddleware(), this._post.bind(this));
        }

        if (this._put !== Endpoint.prototype._put) {
            this.express.put(this.path, ...this.validators, validateMiddleware(), this._put.bind(this));
        }

        if (this._delete !== Endpoint.prototype._delete) {
            this.express.delete(this.path, ...this.validators, validateMiddleware(), this._delete.bind(this));
        }
    }

    protected async _get(req: Request, res: Response): Promise<any> {
        res.status(405).json({error: "Method not allowed"});
    }

    protected async _post(req: Request, res: Response): Promise<any> {
        res.status(405).json({error: "Method not allowed"});
    }

    protected async _put(req: Request, res: Response): Promise<any> {
        res.status(405).json({error: "Method not allowed"});
    }

    protected async _delete(req: Request, res: Response): Promise<any> {
        res.status(405).json({error: "Method not allowed"});
    }
}