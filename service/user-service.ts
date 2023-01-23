import {Types} from "mongoose";
import {User} from "../models";
import bcrypt from "bcrypt"
import {TokenService} from "./index";
import UserDTO from "../data_transfer_objects/user-dto";

class UserService {
    async getUserById(user_id: Types.ObjectId | string) {
        const user = await User.findById(user_id).lean().exec();
        if (!user) throw new Error("User not found");
        else return user;
    }

    async getUserByFilter(filter: any) {
        const user = await User.findOne(filter).lean().exec();
        if (!user) throw new Error("User not found");
        else return user;
    }

    async getUsersById(users_id: Types.ObjectId[] | string[]) {
        return await User.find({_id: {"$in": users_id}}).lean().exec();
    }

    async getUserByIdAndUpdate(user_id: Types.ObjectId | string, updates: any) {
        const user = await User
            .findByIdAndUpdate(user_id, updates, {returnDocument: 'after'})
            .lean()
            .exec();
        if (!user) throw new Error("User not found");
        return user;
    }

    async createUser(name: string, login: string, email: string, password: string) {
        const candidate = await User.findOne({email})
        if (candidate) {
            throw new Error(`User with email ${email} already exists!`)
        }
        const hashed_password = await bcrypt.hash(password, 3)
        const user = await User.create({name, login, email, password: hashed_password})
        const user_DTO = new UserDTO(user)
        const tokens = TokenService.generateTokens({...user_DTO})
        await TokenService.saveToken(user_DTO._id, tokens.refresh_token)

        return {
            ...tokens,
            user
        }
    }

    async loginUser(email: string, password: string) {
        const user = await User.findOne({email: email})
        if (!user)
            throw new Error("User not found!")
        if (!await bcrypt.compare(password, user.password))
            throw new Error("Password is wrong!")

        const user_DTO = new UserDTO(user)
        const tokens = TokenService.generateTokens({...user_DTO})
        await TokenService.saveToken(user_DTO._id, tokens.refresh_token)

        return {
            ...tokens,
            user
        }
    }
}

export default new UserService()