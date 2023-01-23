import "dotenv/config"
import {Types} from "mongoose";
import {Token} from "../models";
import jwt from "jsonwebtoken"

class TokenService {
    generateTokens(payload: any) {
        const jwt_access_secret = process.env.JWT_SECRET_ACCESS_KEY
        const jwt_refresh_secret = process.env.JWT_SECRET_ACCESS_KEY
        if (!jwt_access_secret || !jwt_refresh_secret) throw new Error("JWT secrets is not defined!")

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
}

export default new TokenService()