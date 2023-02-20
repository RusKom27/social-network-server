

export type UserFilter = {
    login?: string,
    name?: string,
    subscribers?: { "$all": string[] },
}

export type UserSort = {
    sort_by_popularity?: ["subscribersCount", OrderBy],
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
    name?: string,
}

export type TopicSort = {
    sort_by_popularity?: ["count", OrderBy],
}

export type OrderBy = "ascending" | "descending" | "asc" | "desc" | 1 | -1