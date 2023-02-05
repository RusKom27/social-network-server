import "dotenv/config"
import {Types} from "mongoose";
import {Token} from "../models";
import jwt from "jsonwebtoken"
import ApiError from "../exeptions/api-error";

class TokenService {
    generateTokens(payload: any) {
        const {jwt_access_secret, jwt_refresh_secret} = TokenService.#validateSecretKeys()
        const access_token = jwt.sign(payload, jwt_access_secret, {expiresIn: "30m"})
        const refresh_token = jwt.sign(payload, jwt_refresh_secret, {expiresIn: "30d"})
        return {
            access_token,
            refresh_token
        }
    }

    async saveToken(user_id: Types.ObjectId | string, refresh_token: string) {
        const tokenData = await Token.findOne({user_id})
        if (tokenData) {
            tokenData.refresh_token = refresh_token
            return tokenData.save()
        }
        return await Token.create({refresh_token, user_id})
    }

    async removeToken(refresh_token: string) {
        return Token.deleteOne({refresh_token}, {returnDocument: 'after'});
    }

    async findToken(refresh_token: string) {
        return Token.findOne({refresh_token});
    }

    static #validateSecretKeys() {
        const jwt_access_secret = process.env.JWT_SECRET_ACCESS_KEY
        const jwt_refresh_secret = process.env.JWT_SECRET_ACCESS_KEY
        if (!jwt_access_secret || !jwt_refresh_secret) throw ApiError.BadRequest("JWT secrets is not defined!")
        return {jwt_access_secret, jwt_refresh_secret}
    }

    validateAccessToken(token: string) {
        try {
            const {jwt_access_secret} = TokenService.#validateSecretKeys()
            return jwt.verify(token, jwt_access_secret) as {user_id: string}
        } catch (err: any) {
            return null
        }
    }

    validateRefreshToken(token: string) {
        try {
            const {jwt_refresh_secret} = TokenService.#validateSecretKeys()
            return jwt.verify(token, jwt_refresh_secret) as {user_id: string}
        } catch (err: any) {
            return null
        }
    }
}

export default new TokenService()