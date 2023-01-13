import {Types} from "mongoose";
import User from "../models/User";

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
};