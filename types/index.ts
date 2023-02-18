
export type PostFilter = {
    author_id?: string | { "$in": string[] },
    text?: RegExp,
    likes?: { "$all": string[] },
}

export type PostSort = {
    sort_by_popularity?: ["likesCount", OrderBy],
    sort_by_relevance?: ["creation_date", OrderBy],
}

export type OrderBy = "ascending" | "descending" | "asc" | "desc" | 1 | -1