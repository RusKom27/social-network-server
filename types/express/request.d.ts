import UserDTO from "../../data_transfer_objects/user-dto";

export {}

declare global {
    namespace Express {
        export interface Request {
            user_id?: string,
            authorization: string
        }
    }
}