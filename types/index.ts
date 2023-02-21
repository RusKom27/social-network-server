

export type UserFilter = {
    login?: RegExp,
    name?: RegExp,
    subscribers?: { "$all": string[] },
}

export type Sort = {
    user?: [string, OrderBy][]
    post?: [string, OrderBy][]
    topic?: [string, OrderBy][]
}

export type PostFilter = {
    author_id?: string | { "$in": string[] },
    text?: RegExp,
    likes?: { "$all": string[] },
}

export type PostSort = {
    sort_by_popularity?: ["likesCount", OrderBy],
    sort_by_relevance?: ["creation_date", OrderBy],
}

export type TopicFilter = {
    name?: RegExp,
}

export type TopicSort = {
    sort_by_popularity?: ["count", OrderBy],
}

export type OrderBy = "ascending" | "descending" | "asc" | "desc" | 1 | -1