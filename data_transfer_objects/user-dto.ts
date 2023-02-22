import {IUser} from "../interfaces";

export default class UserDTO {
    _id: string;
    email: string;
    login: string;
    constructor (user: IUser) {
        this._id = user._id.toString();
        this.email = user.email;
        this.login = user.login;
    }
}