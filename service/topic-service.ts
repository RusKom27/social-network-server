import {Topic} from "../models";
import {deletePunctuationMarks} from "../helpers/misc";
import {IPost} from "../interfaces";
import {TopicFilter} from "../types";
import ApiError from "../exeptions/api-error";

class TopicService {

    async getTopicById(topic_id: string) {
        const topic = await Topic.findById(topic_id).lean().exec();
        if (!topic) throw ApiError.BadRequest("Topic not found");
        return topic;
    }

    async getTopicsByFilter(filter: TopicFilter, sort?: any[], limit = 10) {
        return await Topic.find(filter).sort(sort).limit(limit).lean().exec();
    }

    async addTopicsFromPost(post: IPost) {
        for (const word of post.text.trim().split(/\s+/)) {
            const topic_name = deletePunctuationMarks(word);
            const candidate = await Topic.findOne({name: topic_name}).exec();
            if (candidate)
                await Topic.findByIdAndUpdate(candidate._id, {
                    count: candidate.count + 1,
                    posts: [...candidate.posts, post._id],
                });
            else
                await Topic.create({
                    name: topic_name,
                    posts: [post._id],
                });
        }
    }
}

export default new TopicService();