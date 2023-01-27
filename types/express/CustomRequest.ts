import { Request } from 'express';
import UserDTO from "../../data_transfer_objects/user-dto";

export interface CustomRequest extends Request {
    user_id?: string
}