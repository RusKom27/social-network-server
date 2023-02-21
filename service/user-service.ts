import {Types} from "mongoose";
import {User} from "../models";
import bcrypt from "bcrypt"
import {TokenService} from "./index";
import ApiError from "../exeptions/api-error";

class UserService {
    async getUserById(user_id: Types.ObjectId | string) {
        const user = await User.findById(user_id).lean().exec();
        if (!user) throw ApiError.BadRequest("User not found");
        else return user;
    }

    async getUsersByFilter(filter: any, sort?: any[], limit = 10) {
        return await User.find(filter).sort(sort).limit(limit).lean().exec();
    }

    async getUsersById(users_id: Types.ObjectId[] | string[]) {
        return await User.find({_id: {"$in": users_id}}).lean().exec();
    }

    async getUserByIdAndUpdate(user_id: Types.ObjectId | string, updates: any) {
        const user = await User
            .findByIdAndUpdate(user_id, updates, {returnDocument: 'after'})
            .lean()
            .exec();
        if (!user) throw ApiError.BadRequest("User not found");
        return user;
    }

    async getUsersByUserFollows(user_id: Types.ObjectId | string) {
        return await User
            .find({"subscribers": {"$in": user_id}})
            .lean()
            .exec();
    }

    async createUser(name: string, login: string, email: string, password: string) {
        const candidate = await User.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exists!`)
        }
        const hashed_password = await bcrypt.hash(password, 3)
        const user = await User.create({name, login, email, password: hashed_password})
        const tokens = TokenService.generateTokens({user_id: user._id})
        await TokenService.saveToken(user._id, tokens.refresh_token)

        return {
            ...tokens,
            user_id: user._id
        }
    }

    async loginUser(email: string, password: string) {
        const user = await User.findOne({email: email})
        if (!user)
            throw ApiError.BadRequest("User not found!")
        if (!await bcrypt.compare(password, user.password))
            throw ApiError.BadRequest("Password is wrong!")

        const tokens = TokenService.generateTokens({user_id: user._id})
        await TokenService.saveToken(user._id, tokens.refresh_token)

        return {
            ...tokens,
            user_id: user._id
        }
    }

    async logout(refresh_token: string) {
        return await TokenService.removeToken(refresh_token)
    }

    async refresh(refresh_token: string) {
        if (!refresh_token) {
            throw ApiError.UnauthorizedError()
        }
        const userData = TokenService.validateRefreshToken(refresh_token)
        const tokenFromDB = TokenService.findToken(refresh_token)
        if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()

        const user = await this.getUserById(userData.user_id)
        const tokens = TokenService.generateTokens({user_id: user._id})
        await TokenService.saveToken(user._id, tokens.refresh_token)

        return {
            ...tokens,
            user_id: user._id
        }
    }
}

export default new UserService()