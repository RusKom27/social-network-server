import {Types} from "mongoose";
import User from "../models/User";
import Message from "../models/Message";

export default {
    getUserById: async (user_id: Types.ObjectId | string) => {
        const user = await User.findById(user_id).lean().exec();
        if (!user) throw Error("User not found");
        else return user;
    },

    getUserByFilter: async (filter: any) => {
        const user = await User.findOne(filter).lean().exec();
        if (!user) throw Error("User not found");
        else return user;
    },

    getUsersById: async (users_id: Types.ObjectId[] | string[]) => {
        return await User.find({_id: {"$in": users_id}}).lean().exec();
    },

    getUserByIdAndUpdate: async (user_id: Types.ObjectId | string, updates: any) => {
        const user = await User
            .findByIdAndUpdate(user_id, updates, {returnDocument: 'after'})
            .lean()
            .exec();
        if (!user) throw Error("User not found");
        return user;
    },

    createUser: async (name: string, login: string, email: string, password: string) => {
        const user = new User({name, login, email, password,})
        return await user.save()
    }
};