import { Request } from 'express';
import {Sort} from "../index";

export interface CustomRequest extends Request {
    user_id?: string
    filter?: any,
    sort?: Sort,
    limit?: number,
    page?: number,
}