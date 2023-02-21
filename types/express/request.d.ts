import {Sort} from "../index";

export {}

declare global {
    namespace Express {
        export interface Request {
            user_id?: string,
            filter?: any,
            sort?: Sort,
            limit?: number,
            page?: number,
        }
    }
}